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

gulp.task('styles', function(){
	return sass('public/assets/scss/app.scss', {style: 'expanded', sourcemap: true})
	.pipe(sourcemaps.write())
    .pipe(cssnano())
	.pipe(gulp.dest('public/assets/css'))
	.pipe(notify({message: 'SCSS to CSS Complete.' }));
});

gulp.task('watch', function(){
	gulp.watch('public/assets/scss/**/*', ['styles']); 
	gulp.watch('public/controllers/*', ['scripts']); 
});
