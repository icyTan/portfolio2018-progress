var gulp = require('gulp');
var sass = require('gulp-sass');
var browsersync = require('browser-sync').create(); // Creates a browser-sync instance


// TODO:
// add minification to css
// uglify js
// add modernizr support DONE

// Note this is an example of a higher-order function
gulp.task('browser-sync', function() {
  browsersync.init({
    server: "app",
    port: 5000
  });
});

// can make a default for compile function
gulp.task('sass', function() {
  return gulp.src("app/scss/*.scss") // set retrival
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest("app/css")); // set destination
});

// https://www.browsersync.io/docs/api <--- dont be dumb and follow the new 2.0.0+ API
// format your gulp watches but then calling on a change to the instance of browsersync PLEASE

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('app/scss/*.scss', ['sass']);
  gulp.watch(['app/*.html','app/work/*.html','app/css/*.css','app/js/*.js']).on('change', browsersync.reload); // Should extend this to include css and any other directories
});

gulp.task('default', ['watch']);
