// Require Gulp
var gulp = require('gulp'),
  // Require Gulp-sass plugin
  sass = require('gulp-sass'),
  // Sass globbing import for LibSass
  globbing = require('gulp-sass-glob'),
  // Require Sourcemaps
  sourcemaps = require('gulp-sourcemaps'),
  // Require Browser Sync for livereloading
  browserSync = require('browser-sync').create(),
  // Browser Reloading
  reload = browserSync.reload,
  // Require Del to clean dev folder
  del = require('del'),
  // Require Process HTML
  processHtml = require('gulp-processhtml'),
  // Require iconfont generator plugin
  iconfont = require('gulp-iconfont'),
  iconfontCss = require('gulp-iconfont-css'),
  // Require PostCSS
  postcss = require('gulp-postcss'),
  // Require PostCSS Flexibility
  flexibility = require('postcss-flexibility'),
  // Require PostCSS autoprefixer
  autoprefixer = require('autoprefixer'),
  // Require postCSS clean
  cleanCSS = require('gulp-clean-css'),
  // CSSO Plugin
  csso = require('gulp-csso'),
  // Require Css-MQpacker// Clean CSS
  mqpacker = require('css-mqpacker'),
  mqsorter = require('sort-css-media-queries'),
  // Image optimization plugin
  imagemin = require('gulp-imagemin'),
  // Concat plugin
  concat = require('gulp-concat'),
  // uglify plugin
  uglify = require('gulp-uglify'),
  // Console utility
  util = require("gulp-util");

// Project settings
var config = {
  // Folders for assets, development environment
  folderBase: {
    base: 'http://localhost/doppler_website_new/',
    css: 'http://localhost/doppler_website_new/styles.css',
    js: 'http://localhost/doppler_website_new/*.js',
    php: 'http://localhost/doppler_website_new/*.php'
  },
  folderDev: {
    base: '',
    css: '',
    fonts: 'fonts',
    images: 'img',
    js: ''
  }, // If this path gets changed, remember to update .gitignore with the proper path to ignore images and css
  folderAssets: {
    base: 'assets',
    fonts: 'assets/fonts',
    styles: 'assets/styles',
    images: 'assets/img',
    js: 'assets/js'
  },
  folderDist: {
    base: 'dist',
    css: 'dist',
    fonts: 'dist/fonts',
    images: 'dist/img',
    js: 'dist'
  },
  postCSS: {
    processors: [
      autoprefixer({
        browsers: [
          // 'Android >= 2.3',
          // 'BlackBerry >= 7',
          // 'Chrome >= 9',
          // 'Firefox >= 4',
          // 'Explorer >= 9',
          // 'iOS >= 5',
          // 'Opera >= 11',
          // 'Safari >= 5',
          // 'OperaMobile >= 11',
          // 'OperaMini >= 6',
          // 'ChromeAndroid >= 9',
          // 'FirefoxAndroid >= 4',
          // 'ExplorerMobile >= 9',
          'last 2 versions',
          '> 1%',
          'last 3 iOS versions',
          'Firefox > 20',
          'ie 9' //This is a Default Autoprefixer Config. In case that you need to add other browser support uncomment from above.
        ]
      }),
      mqpacker({
        sort: mqsorter
      })
    ]
  }
};

// Sass tasks are divided for performance issues regarding dependencies
// Sass Build task definition, only ran once
gulp.task('sass:build', ['webfont'], function() {
  return gulp.src(config.folderAssets.styles + '/styles.scss')
    .pipe(globbing({
      // Configure it to use SCSS files
      extensions: ['.scss']
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(config.postCSS.processors))
    .pipe(postcss([flexibility]))
    .pipe(cleanCSS({
      advanced: true
    }))
    .pipe(csso())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.folderDist.css));
});

// Sass Watch task definition
gulp.task('sass', function() {
  return gulp.src(config.folderAssets.styles + '/styles.scss')
    .pipe(globbing({
      // Configure it to use SCSS files
      extensions: ['.scss']
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(config.postCSS.processors))
    .pipe(postcss([flexibility]))
    .pipe(cleanCSS({
      advanced: true
    }))
    .pipe(csso())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.folderDev.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Process HTML task definition for distribution purposes
gulp.task('processHtml:dist', function() {
  return gulp.src(config.folderAssets.base + '/templates/*.php')
    .pipe(processHtml({
      recursive: true,
      environment: 'dist'
    }))
    .pipe(gulp.dest(config.folderDist.base));
});

// Process HTML task definition
gulp.task('processHtml', function() {
  return gulp.src(config.folderAssets.base + '/templates/*.php')
    .pipe(processHtml({
      recursive: true,
      environment: 'dev'
    }))
    .pipe(gulp.dest(config.folderDev.base));
});

// Copy PHP for distribution purposes
gulp.task('php:dist', function() {
  return gulp.src([config.folderAssets.base + '/*.php'])
    .pipe(gulp.dest(config.folderDist.base));
});

// Copy PHP
gulp.task('copy:php', function() {
  return gulp.src([config.folderAssets.base + '/*.php'])
    .pipe(gulp.dest(config.folderDev.base));
});

// Generate webfonts
gulp.task('webfont', ['webfont:copy'], function() {
  return del([config.folderDev.fonts + '/*.scss']);
});

gulp.task('webfont:copy', ['webfont:generate'], function() {
  return gulp.src([config.folderDev.fonts + '/_icon-font.scss'])
    .pipe(gulp.dest(config.folderAssets.styles + '/libs/iconfont/'));
});

gulp.task('webfont:generate', function() {
  var fontName = 'icon-font';
  util.log(config.folderAssets.base + '/icons/');
  return gulp.src([config.folderAssets.base + '/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      fontPath: './fonts/',
      path: config.folderAssets.styles + '/libs/iconfont/gulp-icontemplate.css',
      targetPath: '_icon-font.scss'
    }))
    .pipe(iconfont({
      fontName: fontName,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
      normalize: true,
      fontHeight: 1001
    }))
    .pipe(gulp.dest(config.folderDev.fonts));
});

// Copy fonts to Dev folder
gulp.task('copy:fonts', function() {
  return gulp.src(config.folderAssets.fonts + '/*.*')
    .pipe(gulp.dest(config.folderDev.fonts));
});

// Copy fonts to Dist folder
gulp.task('fonts:dist', function() {
  return gulp.src(config.folderDev.fonts + '/*.*')
    .pipe(gulp.dest(config.folderDist.fonts));
});

// Optimize JS
gulp.task('js:dist', function() {
  return gulp.src([config.folderAssets.js + '/vendors/*.js', config.folderAssets.js + '/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js', {
      newLine: "\r\n;"
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.folderDist.js));
});

//Copy JS
gulp.task('copy:js', ['copy:vendors'], function() {
  return gulp.src([config.folderAssets.js + '/*.js'])
    .pipe(concat('main.js', {
      newLine: "\r\n;"
    }))
    .pipe(gulp.dest(config.folderDev.js));
});

// Copy Vendors
gulp.task('copy:vendors', function() {
  return gulp.src([config.folderAssets.js + '/vendors/*.js'])
    .pipe(concat('vendors.js', {
      newLine: "\r\n;"
    }))
    .pipe(gulp.dest(config.folderDev.js));
});

// Optimize Images
gulp.task('images:dist', function() {
  return gulp.src([config.folderAssets.images + '/**/*'])
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      svgoPlugins: [{
        removeViewBox: true
      }]
    }))
    .pipe(gulp.dest(config.folderDist.images));
});

// Copy Images
gulp.task('copy:images', function() {
  return gulp.src([config.folderAssets.images + '/**/*'])
    .pipe(gulp.dest(config.folderDev.images));
});

// Browser Sync task definition
gulp.task('serve', ['build'], function() {
  browserSync.init({
    proxy: 'http://localhost/doppler_website_new/',
    port: 3000
  });
});

// Watch for changes (Develop)
gulp.task('run', ['serve'], function() {
  gulp.watch(config.folderAssets.base + '/**/*.scss', ['sass']);
  gulp.watch(config.folderAssets.base + '/icons/*.svg', ['webfont', reload]);
  gulp.watch(config.folderAssets.fonts + '/*.*', ['copy:fonts', reload]);
  gulp.watch(config.folderAssets.images + '/**/*.*', ['copy:images', reload]);
  gulp.watch(config.folderAssets.js + '/**/*.js', ['copy:js', reload]);
  gulp.watch(config.folderAssets.base + '/templates/*.php', ['processHtml', reload]);
  gulp.watch(config.folderAssets.base + '/*.php', ['copy:php']);
  util.log('Done!');
});

// Define Dist generation task (Deploy)
gulp.task('dist', ['sass:build', 'fonts:dist', 'js:dist', 'processHtml:dist', 'php:dist', 'images:dist']);

// Define build task
gulp.task('build', ['sass', 'copy:fonts', 'copy:js', 'processHtml', 'copy:php', 'copy:images']);