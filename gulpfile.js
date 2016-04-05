"use strict";

var gulp = require("gulp");
var cleanBuild = require('gulp-clean');
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var minifyCSS = require("gulp-csso");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var server = require("browser-sync");
var runSequence = require('run-sequence');

//Paths to files
var paths = {
  sass: "sass/**/*.{scss,sass}",
  fonts: "fonts/**/*.{woff,woff2}",
  scripts: "js/**/*.js",
  images: "img/**/*.{png,jpg,gif,svg}",
  html: "*.html"
};

// Clean build
gulp.task("clean", function () {
	return gulp.src(
    "build",
    {read: false})
		.pipe(cleanBuild());
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
  return gulp.src("sass/style.scss")
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
});

gulp.task("build-style", ["style"], function(){
  return gulp.src("build/css/style.css")
    .pipe(minifyCSS())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

//JS optimization
gulp.task("script", function() {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(gulp.dest("build/js"))
});

gulp.task("build-js", ["script"], function(){
  return gulp.src("build/js/main.js")
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("build/js"));
});
// Images optimization
gulp.task("build-images", function() {
  return gulp.src(paths.images)
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true
    }))
    .pipe(gulp.dest("build/img"));
});

// Task for copy HTML, is used in wathcer
gulp.task("html", function(){
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
  gulp.watch(paths.html).on("change", server.reload);// пишет Reloading browsers но не перегружает
  //gulp.watch(paths.html, ["html"]).on("change", server.reload); // почему-то не работает
});

// Run build
gulp.task("build", function(){
  runSequence("clean", ["copy","build-style","build-js","build-images"]);
});
