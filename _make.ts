#!/usr/bin/env ts-node
import * as process from 'process';
import spawn from 'cross-spawn';
import * as fs from 'fs-extra';
import * as chokidar from 'chokidar';
import { minify } from 'html-minifier';

const SRC_DIR = __dirname + '/src';
const BUILD_DIR = __dirname + '/build';
const STATIC_DIR = __dirname + '/static';

function main(): void {
  const arg = process.argv.slice(2)[0].trim().toLowerCase();

  if (arg === 'build') {
    build();
  } else if (arg === 'dev') {
    dev();
  } else if (arg === 'clean') {
    clean();
  } else {
    throw `Unrecognized argument: ${arg}!`;
  }
}

async function build(): Promise<void> {
  console.log('Building project...');

  makeBuildDir();
  copyStaticFiles();

  runBuildCommands();
}

async function dev(): Promise<void> {
  console.log('Starting development server');

  makeBuildDir();
  copyStaticFiles();

  runDevCommands();
}

async function clean(): Promise<void> {
  console.log('Cleaning build directory...');
  fs.removeSync(BUILD_DIR);
}

function makeBuildDir(): void {
  try {
    fs.mkdirSync(BUILD_DIR);
  } catch (rawError) {
    const error = rawError as Record<string, unknown>;
    if (!('code' in error && error.code === 'EEXIST')) {
      throw error;
    }
  }
}

function copyStaticFiles(): void {
  fs.copySync(STATIC_DIR, BUILD_DIR);
}

function runBuildCommands(): void {
  console.log('Running tailwind...');
  spawn.sync('tailwindcss -i ./src/style.css -o ./build/style.css --minify');
  console.log('Running tsc...');
  spawn.sync('tsc');
  copyHTML();
}

function runDevCommands(): void {
  copyHTML(false);
  spawn('tsc --watch');
  spawn('tailwindcss -i ./src/style.css -o ./build/style.css --watch');
  watchHTML();

  spawn('lite-server');
}

function copyHTML(minifyHTML = true): void {
  console.log('Parsing HTML...');

  const htmlIn = fs.readFileSync(SRC_DIR + '/index.html').toString();

  const htmlOut = minifyHTML
    ? minify(htmlIn, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true,
        removeRedundantAttributes: true,
      })
    : htmlIn;

  fs.writeFileSync(BUILD_DIR + '/index.html', htmlOut);
}

function watchHTML(): void {
  const watcher = chokidar.watch(SRC_DIR + '/index.html');
  watcher.on('change', (path) => {
    console.log(`${path} changed...`);
    copyHTML(false);
  });
}

main();
