'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var to5 = require('gulp-6to5');

gulp.task('scripts', function () {
    return gulp.src('experiments/**/*.js')
        .pipe(to5({
          modules: 'amd'
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('serve', ['scripts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    directory: true,
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
