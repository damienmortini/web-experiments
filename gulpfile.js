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
var globby = require("globby");

function startWatchify (entry) {

  console.log(entry);

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
      .pipe(source(entry.replace("/app/", "/dist/")))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("."));
  }

  b.on("update", bundle);
  b.on("log", gutil.log);

  bundle();
}

gulp.task("copy", function () {
  return gulp.src([
    "app/experiments/**/*.*",
    "!app/experiments/**/scripts/*.{js,js.map}"
  ], {
    dot: true
  }).pipe(gulp.dest("dist"));
});

gulp.task("scripts", function () {
  globby(["app/experiments/**/scripts/main.js"], function(err, entries) {
    if (err) {
      gutil.log(err);
      return;
    }

    gutil.log(entries);

    for (var i = 0; i < entries.length; i++) {
      startWatchify(entries[i]);
    }
  });
});

gulp.task("build", ["scripts"]);
