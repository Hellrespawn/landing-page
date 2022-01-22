#!/usr/bin/env ts-node
import * as process from 'process';
import spawn from 'cross-spawn';
import * as fs from 'fs-extra';
import * as chokidar from 'chokidar';
import * as htmlMinifier from 'html-minifier';
import * as uglifyJs from 'uglify-js';

const SRC_DIR = __dirname + '/src';
const BUILD_DIR = __dirname + '/build';
const STATIC_DIR = __dirname + '/static';

main();

function main(): void {
  const arg = process.argv.slice(2)[0].trim().toLowerCase();

  if (arg === 'build') {
    console.log('Building project...');
    initBuildDir();
    runBuildCommands();
  } else if (arg === 'dev') {
    console.log('Starting development server');
    initBuildDir();
    runDevCommands();
  } else if (arg === 'clean') {
    console.log('Cleaning build directory...');
    clean();
  } else {
    throw `Unrecognized argument: ${arg}!`;
  }
}

function clean(): void {
  fs.removeSync(BUILD_DIR);
}

function initBuildDir(): void {
  clean();
  createBuildDir();
  copyStaticFiles();
}

function createBuildDir(): void {
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
  console.log('Running tsc...');
  buildTypeScript();
  console.log('Running tailwind...');
  buildCSS();
  console.log('Parsing HTML...');
  buildHTML();
}

function buildTypeScript(): void {
  spawn.sync('tsc');

  const jsIn = fs.readFileSync(BUILD_DIR + '/app.js').toString();

  const jsOut = uglifyJs.minify(jsIn);

  if (jsOut.error) {
    throw jsOut.error;
  }

  fs.writeFile(BUILD_DIR + '/app.js', jsOut.code);
}

function buildCSS(): void {
  spawn.sync('tailwindcss -i ./src/style.css -o ./build/style.css --minify');
}

function buildHTML(depth = 0): void {
  if (depth > 4) {
    throw 'buildHTML recursion depth exceeded!';
  }

  const htmlIn = fs.readFileSync(SRC_DIR + '/index.html', 'utf-8');

  if (htmlIn.length) {
    const htmlOut = htmlMinifier.minify(htmlIn, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      removeRedundantAttributes: true,
    });

    fs.writeFileSync(BUILD_DIR + '/index.html', htmlOut);
  } else {
    buildHTML(depth + 1);
  }
}

function runDevCommands(): void {
  watchTypeScript();
  watchCSS();
  watchHTML();

  spawn('lite-server');
}

function watchTypeScript(): void {
  buildTypeScript();

  chokidar.watch(SRC_DIR + '/app.ts').on('change', (_path) => {
    buildTypeScript();
  });
}

function watchCSS(): void {
  spawn('tailwindcss -i ./src/style.css -o ./build/style.css --minify --watch');
}

function watchHTML(): void {
  buildHTML();

  chokidar.watch(SRC_DIR + '/index.html').on('change', (path) => {
    buildHTML();
  });
}
