var gulp = require('gulp');
var path = require('path');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var simplicity = require('./gulp-simplicity');

var onError = function(err) {
	gutil.beep();
	gutil.log(err);
};

gulp.task('connect', function() {
	connect.server({
		livereload: true,
		port: 8080
	});
});

gulp.task('sim', function() {
	gulp.src("./*.sim")
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(simplicity())
		.pipe(gulp.dest("./"))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch("./*.sim", ['sim']);
});

gulp.task('compile', ['sim']);
gulp.task('default', ['compile', 'connect', 'watch']);
