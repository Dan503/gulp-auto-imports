
var dest = 'test/presets';

gulp.task('preset:es5', function(){
	return gulp.src([
		'./test/js/js-input/**/*.js',
		'./other-test-folder/js/**/*.js'
	])
		.pipe(fileLoader({ preset: 'es5', dest: dest, fileName: 'preset-es5.js'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:es6', function(){
	return gulp.src([
		'./test/js/js-input/**/*.js',
		'./other-test-folder/js/**/*.js'
	])
		.pipe(fileLoader({ preset: 'es6', dest: dest, fileName: 'preset-es6.js'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:jade', function(){
	return gulp.src([
		'./test/jade/jade-input/**/*.jade',
		'./other-test-folder/jade/**/*.jade'
	])
		.pipe(fileLoader({ preset: 'jade', dest: dest, fileName: 'preset.jade'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:pug', function(){
	return gulp.src([
		'./test/pug/pug-input/**/*.pug',
		'./other-test-folder/pug/**/*.pug'
	])
		.pipe(fileLoader({ preset: 'pug', dest: dest, fileName: 'preset.pug'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:sass', function(){
	return gulp.src([
		'./test/sass/sass-input/**/*.sass',
		'./other-test-folder/sass/**/*.sass'
	])
		.pipe(fileLoader({ preset: 'sass', dest: dest, fileName: 'preset.sass'}))
		.pipe(gulp.dest(dest))
})

gulp.task('preset:scss', function(){
	return gulp.src([
		'./test/scss/scss-input/**/*.scss',
		'./other-test-folder/scss/**/*.scss'
	])
		.pipe(fileLoader({ preset: 'scss', dest: dest, fileName: 'preset.scss'}))
		.pipe(gulp.dest(dest))
})

gulp.task('presets', [
	'preset:es5',
	'preset:es6',
	'preset:jade',
	'preset:pug',
	'preset:sass',
	'preset:scss'
])
