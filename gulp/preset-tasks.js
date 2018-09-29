
var gulp = require('gulp');
var fileLoader = require('../');

var dest = 'tests/preset-outputs';

gulp.task('preset:es5', function(){
	return gulp.src([
		'./tests/test/js/js-input/**/*.js',
		'./tests/other-test-folder/js/**/*.js'
	])
		.pipe(fileLoader({ preset: 'es5', dest: dest, fileName: 'preset-es5.js'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:es6', function(){
	return gulp.src([
		'./tests/test/js/js-input/**/*.js',
		'./tests/other-test-folder/js/**/*.js'
	])
		.pipe(fileLoader({ preset: 'es6', dest: dest, fileName: 'preset-es6.js'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:jade', function(){
	return gulp.src([
		'./tests/test/jade/jade-input/**/*.jade',
		'./tests/other-test-folder/jade/**/*.jade'
	])
		.pipe(fileLoader({ preset: 'jade', dest: dest, fileName: 'preset.jade'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:pug', function(){
	return gulp.src([
		'./tests/test/pug/pug-input/**/*.pug',
		'./tests/other-test-folder/pug/**/*.pug'
	])
		.pipe(fileLoader({ preset: 'pug', dest: dest, fileName: 'preset.pug'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:sass', function(){
	return gulp.src([
		'./tests/test/sass/sass-input/**/*.sass',
		'./tests/other-test-folder/sass/**/*.sass'
	])
		.pipe(fileLoader({ preset: 'sass', dest: dest, fileName: 'preset.sass'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:scss', function(){
	return gulp.src([
		'./tests/test/scss/scss-input/**/*.scss',
		'./tests/other-test-folder/scss/**/*.scss'
	])
		.pipe(fileLoader({ preset: 'scss', dest: dest, fileName: 'preset.scss'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:stylus', function(){
	return gulp.src([
		'./tests/test/stylus/stylus-input/**/*.styl',
		'./tests/other-test-folder/stylus/**/*.styl'
	])
		.pipe(fileLoader({ preset: 'stylus', dest: dest, fileName: 'preset.styl'}))
		.pipe(gulp.dest(dest))
})

gulp.task('presets', [
	'preset:es5',
	'preset:es6',
	'preset:jade',
	'preset:pug',
	'preset:sass',
	'preset:scss',
	'preset:stylus',
])
