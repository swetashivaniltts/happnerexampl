var gulp = require('gulp');
var browserify = require('gulp-browserify');
var minify = require('gulp-minify');
var header = require('gulp-header');

// Basic usage 
gulp.task('default', function() {
    // Single entry point to browserify 
    gulp.src('lib/crypto.js')
        .pipe(browserify({
          insertGlobals : false,
          debug : !gulp.env.production,

        }))
        .pipe(minify({
	        exclude: ['tasks'],
	        ignoreFiles: ['-min.js']
	      }))
        .pipe(header('/**HAPPN CRYPTO UTILS**/\r\n'))
        .pipe(gulp.dest('./build'))
});