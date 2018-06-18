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

var paths = {
  src:      'app/src/**/*',
  srcHTML:  'app/src/**/*.html',
  srcSCSS:  'app/src/**/*.scss',
  srcMSCSS: 'app/src/scss/main.scss', // only the main scss file (dont need to grab all the scss partials when processing)
  srcJS:    'app/src/**/*.js',

  tmp:      'app/tmp',
  tmpIndex: 'app/tmp/index.html',
  tmpHTML:  'app/tmp/',
  tmpCSS:   'app/tmp/css',
  tmpJS:    'app/tmp/js',

  dist:      'app/dist',
  distIndex: 'app/dist/index.html',
  distHTML:  'app/dist/**/*.html',
  distCSS:   'app/dist/**/*.css',
  distJS:    'app/dist/**/*.js',
}

// folder structure
// src - pre processed
// tmp - dev server, not minified, procesed
// dist - processed and minified files

// TODO:
// uglify js TEST
// concat all scss
// eventually pipe a production build

// DONE:
// add modernizr support DONE
// add minification to css TEST (????)

gulp.task('browser-sync', function() {
  browsersync.init({
    server: "app/tmp",
    port: 5000
  });
});

// html task
gulp.task('html', function(){
  return gulp.src(paths.srcHTML)
    .pipe(gulp.dest(paths.tmp));
});

// do sass task
gulp.task('scss', function() {
  return gulp.src(paths.srcMSCSS) // return this : set retrival
    .pipe(sourcemaps.init()) // init sourcemaps
    .pipe(sass({
      errorLogToConsole: true,
      outputStyle: 'expanded' // output as uglifed
    })
    .on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./')) // write sourcemaps
    .pipe(gulp.dest(paths.tmpCSS)); // set destination
});

gulp.task('js', function(){
  return gulp.src(paths.srcJS)
  .pipe(concat('app.min.js'))
  // .pipe(uglify()) // TAKE THIS OUT AFTER DEBUG
  .pipe(gulp.dest(paths.tmpJS))
});

// https://www.browsersync.io/docs/api <--- dont be dumb and follow the new 2.0.0+ API
// format your gulp watches but then calling on a change to the instance of browsersync PLEASE

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(paths.srcSCSS, ['sass']); // watch these items, do this function
  gulp.watch(paths.srcJS,['js']);
  gulp.watch(paths.src,['refresh']);
});

gulp.task('refresh', function () {
  browsersync.reload();
});

// base copy function
gulp.task('copyAll', function(){
  return gulp.src(paths.src)
    .pipe(gulp.dest(paths.tmp));
});

// copy and set files for temp server
gulp.task('copy', ['scss','js'], function(){
  gulp.src(paths.srcHTML)
    .pipe(gulp.dest(paths.tmpHTML));
});

gulp.task('default', ['watch']);
