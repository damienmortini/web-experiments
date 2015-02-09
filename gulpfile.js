'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
// var to5 = require('gulp-6to5');
var transform = require('vinyl-transform');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var to5ify = require('6to5ify');

// es6ModulesEntries

gulp.task('scripts', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    b.transform(to5ify);
    return b.bundle();
  });

  return gulp.src(['./experiments/**/main.js'])
    .pipe(browserified)
    .pipe(gulp.dest('./.tmp/'));
});

gulp.task('serve', ['scripts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    directory: true,
    open: false,
    server: {
      baseDir: ['.tmp', 'experiments'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'experiments/**/*',
    '.tmp/**/*'
  ]).on('change', browserSync.reload);

  gulp.watch('experiments/**/*.js', ['scripts']);
});
