import { src, dest, parallel, watch as gulpWatch, series } from 'gulp';
import postcss from 'gulp-postcss';
import htmlmin from 'gulp-htmlmin';
import ts from 'gulp-typescript';
import uglify from 'gulp-uglify';
import BrowserSyncStatic from 'browser-sync';
import del from 'del';

const browserSync = BrowserSyncStatic.create();

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

async function testServer() {
  browserSync.init({
    files: ['./static/**/*', './build/**/*'],
    server: {
      baseDir: './build',
    },
    ui: false,
    notify: false,
  });
}
const buildAll = parallel(staticFiles, css, html, typescript);

async function watchAll() {
  gulpWatch('./static/**/*', staticFiles);
  gulpWatch('./src/*.{css,html,ts}', css);
  gulpWatch('./src/*.html', html);
  gulpWatch('./src/*.ts', typescript);
}

export const clean = () => del(['./build/**', './build']);

export const build = series(clean, buildAll);

export const watch = series(clean, buildAll, watchAll);

export const dev = series(clean, buildAll, parallel(watchAll, testServer));

export default build;
