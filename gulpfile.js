var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	cssnano = require('gulp-cssnano'),
	notify = require('gulp-notify'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	cache = require('gulp-cache'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function(){
	return gulp.src(['public/controllers/routes.js','public/controllers/*.js'])
	.pipe(sourcemaps.init())
    .pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(concat('app.js'))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('public/assets/js'))
	.pipe(notify({message: 'JS files merged.'}));
});

gulp.task('watch', function(){
//	gulp.watch('build/styles/**/*', ['styles']);
	gulp.watch('public/controllers/*', ['scripts']);
});
