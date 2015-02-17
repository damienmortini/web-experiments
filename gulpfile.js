'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');

var to5ifyFiles = [
  './experiments/raymarch-physic/scripts/main.js'
];

gulp.task('scripts', function (callback) {
  for (var i = 0; i < to5ifyFiles.length; i++) {
    var file = to5ifyFiles[i];
    var b = browserify([
      require.resolve('babelify/polyfill'),
      './bower_components/fetch/fetch.js',
      file]
    );
    b.transform(babelify);
    b.bundle()
      .on('error', function(err){
        console.error(err.message);
        this.end();
      })
      .pipe(source(file))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./.tmp'));
  }
 callback();
});

gulp.task('serve', ['scripts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    directory: true,
    server: {
      baseDir: ['./.tmp', './'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'experiments/**/*',
    '!experiments/**/*.js',
    '.tmp/**/*',
    '!.tmp/**/*.map'
  ]).on('change', reload);

  gulp.watch('experiments/**/*.js', ['scripts']);
});
