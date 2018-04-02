// from https://www.youtube.com/watch?v=0jmNon-R3II
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var browsersync = require('browser-sync').create(); // Creates a browser-sync instance

var jsInput = {
  js: 'app/js/dev/*.js'
}
var jsOutput = 'app/js/dist/'

// TODO:
// uglify js TEST
// concat all scss
// eventually pipe a production build

// DONE:
// add modernizr support DONE
// add minification to css TEST (????)

gulp.task('browser-sync', function() {
  browsersync.init({
    server: "app",
    port: 5000
  });
});

// do sass task
gulp.task('sass', function() {
  return gulp.src("app/scss/**/*.scss") // return this : set retrival
    .pipe(sourcemaps.init()) // init sourcemaps
    .pipe(sass({
      errorLogToConsole: true,
      outputStyle: 'compressed' // output as uglifed
    })
    .on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./')) // write sourcemaps
    .pipe(gulp.dest("app/css")); // set destination
});

gulp.task('js', function(){
  return gulp.src(jsInput.js)
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js/dist'))
});

// https://www.browsersync.io/docs/api <--- dont be dumb and follow the new 2.0.0+ API
// format your gulp watches but then calling on a change to the instance of browsersync PLEASE

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']); // watch these items, do this function
  gulp.watch('app/js/**/*.js',['js']); // watch these items
  gulp.watch(['app/*.html','app/work/*.html','app/css/*.css','app/js/dev/*.js']).on('change', browsersync.reload); // Should extend this to include css and any other directories
});

gulp.task('default', ['watch']);
