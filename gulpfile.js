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
  // Require Sassdoc
  sassdoc = require('sassdoc'),
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
  // uglify plugin
  uglify = require('gulp-uglify'),
  // Concat plugin
  concat = require('gulp-concat'),
  // Console utility
  util = require("gulp-util"),
  // Image optimization plugin
  imagemin = require('gulp-imagemin');


// Project settings
var config = {
  // Folders for assets, development environment
  folderDev: {
    base: 'dev',
    css: 'dev/css',
    fonts: 'dev/fonts',
    images: 'dev/img',
    js: 'dev/js',
    docs: 'dev/documentation'
  }, // If this path gets changed, remember to update .gitignore with the proper path to ignore images and css
  folderAssets: {
    base: 'assets',
    fonts: 'assets/fonts',
    styles: 'assets/scss',
    images: 'assets/img',
    html: 'assets/templates',
    js: 'assets/js'
  },
  folderDist: {
    base: 'dist',
    css: 'dist/css',
    fonts: 'dist/fonts',
    images: 'dist/img',
    js: 'dist/js',
    docs: 'dist/documentation'
  },
  postCSS: {
    processors: [
      autoprefixer({
        browsers: [
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
  },

// Sassdoc task options
  sassdocOptionsDev: {
    dest: './dev/documentation',
      display: {
        watermark: false
      },
    groups: {
      'undefined': 'general'
    },
    package: {
      title: "Doppler UI Library",
      homepage: "/",
    }
  },
  sassdocOptionsDist: {
    dest: './dist/documentation',
      display: {
        watermark: false
      },
    groups: {
      'undefined': 'general'
    },
    package: {
      title: "Doppler UI Library",
      homepage: "/",
    }
  }
};

// Sass tasks are divided for performance issues regarding dependencies
gulp.task('sass:dist', ['webfont'], function() {
  return gulp.src(config.folderAssets.styles + '/styles.scss')
    .pipe(globbing({
      // Configure it to use SCSS files
      extensions: ['.scss']
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(config.postCSS.processors))
    .pipe(postcss([flexibility]))
    .pipe(cleanCSS({
      advanced: true
    }))
    .pipe(csso())
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

// Sass theme editors task definition
gulp.task('sass-editors', function() {
  return gulp.src(config.folderAssets.styles + '/themes/editors/editors.scss')
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

// Sass theme editors tasks are divided for performance issues regarding dependencies
gulp.task('sass-editors:dist', function() {
  return gulp.src(config.folderAssets.styles + '/themes/editors/editors.scss')
    .pipe(globbing({
      // Configure it to use SCSS files
      extensions: ['.scss']
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(config.postCSS.processors))
    .pipe(postcss([flexibility]))
    .pipe(cleanCSS({
      advanced: true
    }))
    .pipe(csso())
    .pipe(gulp.dest(config.folderDist.css));
});

// Sass theme dark task definition
gulp.task('sass-theme-dark', function() {
  return gulp.src(config.folderAssets.styles + '/themes/theme-dark/theme-dark.scss')
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

// Sass theme dark tasks are divided for performance issues regarding dependencies
gulp.task('sass-theme-dark:dist', function() {
  return gulp.src(config.folderAssets.styles + '/themes/theme-dark/theme-dark.scss')
    .pipe(globbing({
      // Configure it to use SCSS files
      extensions: ['.scss']
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(config.postCSS.processors))
    .pipe(postcss([flexibility]))
    .pipe(cleanCSS({
      advanced: true
    }))
    .pipe(csso())
    .pipe(gulp.dest(config.folderDist.css));
});

// Generated Sassdoc to Dev folder
gulp.task('doc', function() {
  return gulp.src(config.folderAssets.base + '/**/*.scss')
    .pipe(sassdoc(config.sassdocOptionsDev))
    .resume();
});

// Generated Sassdoc to Dist folder
gulp.task('doc:dist', function() {
  return gulp.src(config.folderAssets.base + '/**/*.scss')
    .pipe(sassdoc(config.sassdocOptionsDist))
    .resume();
});

// Process HTML task definition for distribution purposes
gulp.task('processHtml:dist', function() {
  return gulp.src(config.folderAssets.base + '/templates/*.html')
    .pipe(processHtml({
      recursive: true,
      environment: 'dist'
    }))
    .pipe(gulp.dest(config.folderDist.base));
});

// Generate webfonts
gulp.task('webfont', function() {
  var fontNameBase = 'icon-font';

  return gulp.src([config.folderAssets.base + '/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: fontNameBase,
      path: config.folderAssets.styles + '/libs/iconfont/gulp-icontemplate.css',
      targetPath: '../scss/libs/iconfont/_icon-font.scss',
      fontPath: '../fonts/'
    }))
    .pipe(iconfont({
      fontName: fontNameBase,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
      normalize: true,
      fontHeight: 1001
    }))
    .pipe(gulp.dest(config.folderAssets.fonts));
});

// Copy webfont to Dist folder
gulp.task('fonts:dist', ['webfont'], function() {
  return gulp.src(config.folderAssets.fonts + '/*.*')
    .pipe(gulp.dest(config.folderDist.fonts));
});

// Copy webfonts to Dev folder
gulp.task('copy:fonts', ['webfont'], function() {
  return gulp.src(config.folderAssets.fonts + '/*.*')
    .pipe(gulp.dest(config.folderDev.fonts));
});

// Optimize JS
gulp.task('js:dist', function() {
  return gulp.src([config.folderAssets.js + '/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js', {
      newLine: "\r\n;"
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.folderDist.js));
});

gulp.task('copy:workerjs', function() {
  return gulp.src([
    config.folderAssets.base + '/sw.js',
    config.folderAssets.base + '/firebase-messaging-sw.js',
    config.folderAssets.base + '/firebasePush.js',
    ])
    .pipe(gulp.dest(config.folderDev.base))
    .pipe(gulp.dest(config.folderDist.base));
});

//Copy JS
gulp.task('copy:js', function() {
  return gulp.src([config.folderAssets.js + '/*.js'])
    .pipe(concat('main.js', {
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
  return browserSync.init({
    port: 3500,
    server: {
      baseDir: config.folderDev.base
    },
    ui: {
      port: 3501
    }
  });
});

// Process HTML task definition
gulp.task('processHtml', function() {
  return gulp.src(config.folderAssets.base + '/templates/*.html')
    .pipe(processHtml({
      recursive: true,
      environment: 'dev'
    }))
    .pipe(gulp.dest(config.folderDev.base))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Delete dev folder for cleaning
gulp.task('clean', ['clean:dev']);

gulp.task('clean:dev', function() {
  return del.sync(config.folderDev.base);
});

// Watch for changes
gulp.task('run', ['clean', 'serve'], function() {
  gulp.watch([config.folderAssets.base + '/**/*.scss', '!' + config.folderAssets.styles + '/themes/**/*.scss'] , ['sass', 'doc']);
  gulp.watch(config.folderAssets.styles + '/themes/editors/**/*.scss', ['sass-editors', 'doc']);
  gulp.watch(config.folderAssets.styles + '/themes/theme-dark/**/*.scss', ['sass-theme-dark', 'doc']);
  gulp.watch(config.folderAssets.base + '/icons/*.svg', ['webfont', reload]);
  gulp.watch(config.folderAssets.fonts + '/*.*', ['copy:fonts', reload]);
  gulp.watch(config.folderAssets.images + '/**/*.*', ['copy:images']);
  gulp.watch(config.folderAssets.js + '/**/*.js', ['copy:js', reload]);
  gulp.watch(config.folderAssets.base + '/templates/**/*.*', ['processHtml']);
  util.log('Done!');
});


// Define build task
gulp.task('build', ['sass', 'sass-editors', 'sass-theme-dark', 'webfont', 'copy:fonts', 'processHtml', 'copy:js', 'copy:images', 'doc', 'copy:workerjs']);

// Define Dist generation task (Deploy)
gulp.task('dist', ['sass:dist', 'sass-editors:dist', 'sass-theme-dark:dist', 'fonts:dist', 'processHtml:dist', 'js:dist', 'images:dist', 'doc:dist', 'copy:workerjs']);
