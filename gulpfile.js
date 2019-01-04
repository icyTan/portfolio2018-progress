var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var terser = require('gulp-terser');
var data = require('gulp-data');
var watch = require('gulp-watch');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var changed = require('gulp-changed');
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
  distHTML:   'app/dist/',
  distCSS:    'app/dist/css',
  distJS:     'app/dist/js',

  njkFiles:   ['app/src/*.njk','app/src/work/*.njk'],
  templates:  'app/src/',
  jsonFile:   './app/src/data/data.json',

}

// folder structure
// src - pre processed
// tmp - dev server, not minified, procesed
// dist - processed and minified files

// TODO:
// terser js TEST
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
    port: 5000,
    open: false
  });
});

// process scss files and make sourcemaps
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
    .pipe(gulp.dest(paths.tmpCSS)) // set destination
});

// copy all remaining css files (for fontawesome)
gulp.task('css',function(){
  return gulp.src(paths.srcCSS,{
    nodir: true
  })
  .pipe(gulp.dest(paths.tmpDest)) // hacking the directories instead of properly copying
});

// concat js files
gulp.task('js', function(){
  return gulp.src(paths.srcJS)
  .pipe(concat('app.min.js'))
  .pipe(gulp.dest(paths.tmpJS))
});

// process nunjucks files
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

// https://gulpjs.org/recipes/only-pass-through-changed-files.html
// uses compare copy so it can run in watch so it doesn't constantly copy all new files
gulp.task('compare-copy-images',function(){
  return gulp.src(paths.srcIMG,{
    base: 'app/src/' // https://opnsrce.github.io/how-to-make-gulp-copy-a-directory-and-its-contents
    // How to preserve folder structure with gulp dest
  }).pipe(changed(paths.tmpDest))
    .pipe(gulp.dest(paths.tmpDest))
})

gulp.task('refresh', function () {
  browsersync.reload();
});

// gulp watch task for rendering nunjucks pages
gulp.task('watch-html', ['browser-sync'], function(){
  gulp.watch(paths.srcHTML,['render', 'refresh']);
});

//***************************************************************
// watch tasks for correct reload times
gulp.task('scss-watch',['scss'], function(done){
  browsersync.reload();
  done();
});
gulp.task('js-watch',['js'], function(done){
  browsersync.reload();
  done();
});
gulp.task('nunjucks-watch',['nunjucks'], function(done){
  browsersync.reload();
  done();
});
gulp.task('img-watch',['compare-copy-images'], function(done){
  browsersync.reload();
  done();
});

// https://www.browsersync.io/docs/api <--- dont be dumb and follow the new 2.0.0+ API
// format your gulp watches but then calling on a change to the instance of browsersync PLEASE

// task should perform processing then send to tmp and then refresh
// https://stackoverflow.com/questions/22082641/gulp-watch-execute-tasks-in-order-synchronous
// not executing tasks in order, not a problem ATM but not properly implemented
// proper order should be
// if changes in scss/js/njk then process sepcific filetype scss/js/njk then refresh

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(paths.srcSCSS, ['scss-watch']);
  gulp.watch(paths.srcJS,['js-watch']);
  gulp.watch(paths.srcHTML,['nunjucks-watch']);
  gulp.watch(paths.srcIMG,['img-watch']);
  // gulp.watch(paths.tmp,['refresh']); // hacked method for sequential task run
});

// refer to base versions of these tasks for notes
gulp.task('scss-dist', function() {
  return gulp.src(paths.srcMSCSS)
    .pipe(sass({
      errorLogToConsole: true,
      outputStyle: 'compressed' // output as uglifed
    })
    .on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.distCSS))
});

gulp.task('css-dist',function(){
  return gulp.src(paths.srcCSS,{
    nodir: true
  })
  .pipe(gulp.dest(paths.dist))
});

gulp.task('js-dist', function(){
  return gulp.src(paths.srcJS)
  .pipe(concat('app.min.js'))
  .pipe(gulp.dest(paths.distJS))
  .pipe(terser())
  .pipe(gulp.dest(paths.distJS))
});


gulp.task('nunjucks-dist',function(){
  return gulp.src(paths.njkFiles,{
    base: 'app/src/'
  })
    .pipe(data(function() {
      return require(paths.jsonFile)
    }))
    .pipe(nunjucksRender({
      path: paths.templates
    }))
    .pipe(gulp.dest(paths.distHTML))
});

gulp.task('compare-copy-images-dist',function(){
  return gulp.src(paths.srcIMG,{
    base: 'app/src/'
  }).pipe(changed(paths.dist))
    .pipe(gulp.dest(paths.dist))
});

// copy and set files for temp server
gulp.task('build-temp',['nunjucks','scss','css','js','compare-copy-images']);

// build files and send to dist folder
gulp.task('build',['nunjucks-dist','scss-dist','css-dist','js-dist','compare-copy-images-dist']);

gulp.task('clean',function(){
  return del([
    'app/dist/',
    'app/tmp/'
  ])
});

gulp.task('default', ['watch']);
