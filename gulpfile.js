// from https://www.youtube.com/watch?v=0jmNon-R3II
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemap');
var browsersync = require('browser-sync').create(); // Creates a browser-sync instance


// TODO:
// add minification to css
// uglify js
// add modernizr support DONE

gulp.task('browser-sync', function() {
  browsersync.init({
    server: "app",
    port: 5000
  });
});

// can make a default for compile function
gulp.task('sass', function() {
  return gulp.src("app/scss/*.scss") // return this : set retrival
    .pipe(sourcemaps.init()) // init sourcemaps
    .pipe(autoprefixer({
      browser: ['last 2 version'],
      cascade: false
    }))
    .pipe(sass({
      outputStyle: 'compressed' // output as uglifed
    })
    .on('error', sass.logError))
    .pipe(sourcemaps.write('app/maps')) // write sourcemaps
    .pipe(gulp.dest("app/css")); // set destination
});

// https://www.browsersync.io/docs/api <--- dont be dumb and follow the new 2.0.0+ API
// format your gulp watches but then calling on a change to the instance of browsersync PLEASE

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('app/scss/*.scss', ['sass']); // watch these items, do this function
  gulp.watch(['app/*.html','app/work/*.html','app/css/*.css','app/js/*.js']).on('change', browsersync.reload); // Should extend this to include css and any other directories
});

gulp.task('default', ['watch']);
