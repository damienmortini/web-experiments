"use strict";

var watchify = require("watchify");
var browserify = require("browserify");
var gulp = require("gulp");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var gutil = require("gulp-util");
var sourcemaps = require("gulp-sourcemaps");
var babelify = require("babelify");
var assign = require("lodash.assign");
var changed = require('gulp-changed');
var globby = require("globby");
var browserSync = require('browser-sync');
var reload = browserSync.reload;

function startWatchify (entry) {
  var customOpts = {
    entries: [entry],
    debug: true
  };
  var opts = assign({}, watchify.args, customOpts);
  var b = watchify(browserify(opts));
  b.transform(babelify);

  function bundle() {
    return b.bundle()
      .on("error", gutil.log.bind(gutil, "Browserify Error"))
      .pipe(source(entry.replace("/app/", "/")))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("./dist"))
      .pipe(reload({stream: true}));
  }

  b.on("update", bundle);
  b.on("log", gutil.log);

  bundle();
}

gulp.task("browser-sync", function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ["dist"]
    }
  });

  gulp.watch("./app/**/*", ["copy"]);
});

gulp.task("copy", function () {
  return gulp.src([
    "./app/**/*",
    "!./app/**/*.{js,js.map}"
  ], {
    dot: true
  })
  .pipe(changed("./dist"))
  .pipe(gulp.dest("./dist"))
  .pipe(reload({stream: true}));
});

gulp.task("scripts", function () {
  globby(["./app/experiments/**/scripts/main.js"], function(err, entries) {
    if (err) {
      gutil.log(err);
      return;
    }

    for (var i = 0; i < entries.length; i++) {
      startWatchify(entries[i]);
    }
  });
});

gulp.task("serve", ["copy", "scripts", "browser-sync"]);

gulp.task("build", ["copy", "scripts"]);
