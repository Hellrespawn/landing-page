import { src, dest, parallel, watch as gulpWatch } from 'gulp';
import postcss from 'gulp-postcss';
import htmlmin from 'gulp-htmlmin';
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';
import browserSyncFactory from 'browser-sync';

const browserSyncInstance = browserSyncFactory.create();

function staticFiles() {
  return src('./static/**/*').pipe(dest('./build'));
}

function css() {
  return src('./src/*.css').pipe(postcss()).pipe(dest('./build/'));
}

function html() {
  return src('src/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
      })
    )
    .pipe(dest('./build/'));
}

function typescript() {
  const tsProject = ts.createProject('tsconfig.json');

  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(uglify())
    .pipe(dest('./build/'));
}

async function browserSync() {
  browserSyncInstance.init({
    files: ['./static/**/*', './build/**/*'],
    server: {
      baseDir: './build',
    },
    ui: false,
    notify: false,
  });
}

export const build = parallel(staticFiles, css, html, typescript);

export async function watch() {
  gulpWatch('./static/**/*', { ignoreInitial: false }, staticFiles);
  gulpWatch('./src/*.{css,html,ts}', { ignoreInitial: false }, css);
  gulpWatch('./src/*.html', { ignoreInitial: false }, html);
  gulpWatch('./src/*.ts', { ignoreInitial: false }, typescript);
}

export const dev = parallel(watch, browserSync);

export default build;
