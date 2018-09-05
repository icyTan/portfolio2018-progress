// from https://www.youtube.com/watch?v=0jmNon-R3II
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var data = require('gulp-data');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var nunjucks = require('nunjucks');
var nunjucksRender = require('gulp-nunjucks-render');
var browsersync = require('browser-sync').create(); // Creates a browser-sync instance

var paths = {
  src:        'app/src/**/*',
  srcHTML:    'app/src/**/*.+(html|njk)',
  srcCSS:     'app/src/**/*.css',
  srcSCSS:    'app/src/**/*.scss',
  srcMSCSS:   'app/src/scss/main.scss', // only the main scss file (dont need to grab all the scss partials when processing)
  srcJS:      'app/src/**/*.js',
  srcIMG:     'app/src/images/**/*',

  tmp:        'app/tmp/**/*',
  tmpDest:    'app/tmp/',
  tmpIndex:   'app/tmp/index.html',
  tmpHTML:    'app/tmp/',
  tmpCSS:     'app/tmp/css',
  tmpJS:      'app/tmp/js',

  dist:       'app/dist',
  distIndex:  'app/dist/index.html',
  distHTML:   'app/dist/**/*.html',
  distCSS:    'app/dist/**/*.css',
  distJS:     'app/dist/**/*.js',

  njkFiles:   ['app/src/*.njk','app/src/work/*.njk'],
  templates:  'app/src/',
  jsonFile:   './app/src/data/data.json',

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
// https://medium.com/@andy.neale/nunjucks-a-javascript-template-engine-7731d23eb8cc
// add templating from nunjucks
// add modernizr support DONE
// add minification to css TEST (????)

gulp.task('browser-sync', function() {
  browsersync.init({
    server: "app/tmp",
    port: 5000
  });
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

gulp.task('css',function(){
  return gulp.src(paths.srcCSS,{
    nodir: true
  })
  .pipe(gulp.dest(paths.tmpDest)) // hacking the directories instead of properly copying
});

gulp.task('js', function(){
  return gulp.src(paths.srcJS)
  .pipe(concat('app.min.js'))
  // .pipe(uglify()) // TAKE THIS OUT AFTER DEBUG
  .pipe(gulp.dest(paths.tmpJS))
});

gulp.task('refresh', function () {
  browsersync.reload();
});

gulp.task('nunjucks',function(){
  return gulp.src(paths.njkFiles,{
    base: 'app/src/' // https://opnsrce.github.io/how-to-make-gulp-copy-a-directory-and-its-contents
    // How to preserve folder structure with gulp dest
  })
    .pipe(data(function() {
      return require(paths.jsonFile) // this json file contains all the data that can be accessed to populate pages with
    }))
    .pipe(nunjucksRender({
      path: paths.templates
    }))
    .pipe(gulp.dest(paths.tmpHTML))
});

gulp.task('copy-images',function(){
  return gulp.src(paths.srcIMG,{
    base: 'app/src/' // https://opnsrce.github.io/how-to-make-gulp-copy-a-directory-and-its-contents
    // How to preserve folder structure with gulp dest
  }).pipe(gulp.dest(paths.tmpDest))
});

// gulp watch task for rendering nunjucks pages
gulp.task('watch-html', ['browser-sync'], function(){
  gulp.watch(paths.srcHTML,['render', 'refresh']);
});

// https://www.browsersync.io/docs/api <--- dont be dumb and follow the new 2.0.0+ API
// format your gulp watches but then calling on a change to the instance of browsersync PLEASE

// task should perform processing then send to tmp and then refresh
// https://stackoverflow.com/questions/22082641/gulp-watch-execute-tasks-in-order-synchronous
// not executing tasks in order, not a problem ATM but not properly implemented
// proper order should be
// if changes in scss/js/njk then process sepcific filetype scss/js/njk then refresh

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(paths.srcSCSS, ['scss']);
  gulp.watch(paths.srcJS,['js']);
  gulp.watch(paths.srcHTML,['nunjucks']);
  gulp.watch(paths.tmp,['refresh']); // hacked method for sequential task run
});




// copy and set files for temp server
gulp.task('copy',['nunjucks','scss','css','js']);

// build files and send to dist folder
gulp.task('build-dist',['refresh']); // TODO

// build files and send to dist folder
gulp.task('build-test',['refresh']); // TODO

gulp.task('default', ['watch']);
