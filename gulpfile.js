var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

/**
 * We need to update the paths when we have the project folders hierarchy.
 */
var paths = {
  styles: 'sass',
  tmpStyles: 'tmp'
};

/**
 * Compile sass files to css.
 * Relies on: "gulp-sass".
 */
gulp.task('styles', function () {
  return gulp.src([
    paths.styles + '/styles.scss',
  ])
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  // TODO: add sourcemaps
  .pipe(gulp.dest(paths.tmpStyles));
});

gulp.task('default', [
  'styles',
]);