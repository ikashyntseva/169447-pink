"use strict";

var gulp = require("gulp");
var clean = require('gulp-clean');
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var minifyCSS = require("gulp-csso");
var minifyJS = require("gulp-uglify");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var server = require("browser-sync");

//Paths to files
var paths = {
  sass: "sass/**/*.{scss,sass}",
  fonts: "fonts/**/*.{woff,woff2}",
  scripts: "js/**/*.js",
  images: "img/**/*.{png,jpg,gif,svg}",
  html: "*.html"
};

// Clean
gulp.task("cleanAll", function () {
	return gulp.src(
    ["build/css/*.css",
    "build/js/*.js",
    "build/*.html"],
    {read: false})
		.pipe(clean());
});

// Copy files to /build
gulp.task("copy", function(){
  gulp.src(paths.fonts)
  .pipe(gulp.dest("build/fonts"));
  gulp.src(paths.html)
  .pipe(gulp.dest("build"));
});

// CSS optimization
gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass({
      includePaths: require("node-normalize-scss").includePaths
    }))
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions"
      ]}),
      mqpacker({
        sort: false
      })
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minifyCSS())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

//JS optimization
gulp.task("script", function() {
  gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(gulp.dest("build/js"))
    .pipe(minifyJS())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("build/js"));
});
// Images optimization
gulp.task("images", function() {
  return gulp.src(paths.images)
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true
    }))
    .pipe(gulp.dest("build/img"));
});
gulp.task("html",function(){
  gulp.src(paths.html)
    .pipe(gulp.dest("build"));
});
// Live server and watcher
gulp.task("serve", ["style"], function() {
  server.init({
    server: "build",
    notify: false,
    open: true,
    ui: false
  });
  gulp.watch(paths.scripts, ["script"]);
  gulp.watch(paths.sass, ["style"]);
  gulp.watch(paths.html, ["html"]);
  gulp.watch(paths.html).on("change", server.reload);
});

// Run build
gulp.task("build", ["cleanAll","copy","style","script","images"]);
