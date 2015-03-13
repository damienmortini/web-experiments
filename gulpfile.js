'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');

var es6Files = [
  './experiments/raymarch-physic/scripts/main.js'
];

function setupBundler (file) {
  var bundler = watchify(browserify([
    require.resolve('babelify/polyfill'),
    './bower_components/fetch/fetch.js',
    file
  ], watchify.args));
  bundler.transform(babelify);
  bundler.on('update', bundle);
  bundler.on('log', function (log) {
    console.log(log);
    reload();
  });
  function bundle () {
    return bundler.bundle()
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
  bundle();
}

gulp.task('scripts', function (callback) {
  for (var i = 0; i < es6Files.length; i++) {
    setupBundler(es6Files[i]);
  }
  // for (var i = 0; i < es6Files.length; i++) {
  //   var file = es6Files[i];
  //
  //   var bundler = browserify([
  //     require.resolve('babelify/polyfill'),
  //     './bower_components/fetch/fetch.js',
  //     file]
  //   );
  //   bundler.transform(babelify);
  //
  //   bundler.bundle()
  //     .on('error', function(err){
  //       console.error(err.message);
  //       this.end();
  //     })
  //     .pipe(source(file))
  //     .pipe(buffer())
  //     .pipe(sourcemaps.init({loadMaps: true}))
  //     .pipe(sourcemaps.write('./'))
  //     .pipe(gulp.dest('./.tmp'));
  // }
  // reload();
  callback();
});

gulp.task('serve', ['scripts'], function () {
  browserSync({
    notify: false,
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
    '!experiments/**/*.js'
  ]).on('change', reload);

  // gulp.watch('experiments/**/*.js', ['scripts']);
});
