
var gulp = require('gulp');

var fileLoader = require('./index');


gulp.task('default', function(){

	var dest = 'test/scss';

	return gulp.src([
		'./test/scss/scss-input/**/*.scss',
		'./other-test-folder/scss/**/*.scss'
	])
		.pipe(fileLoader({
			format: '@import "$path";',
			//needed so that relative paths are able to be generated properly
			dest: dest,
			fileName: 'file-loader.scss'
		}))
		.pipe(gulp.dest(dest))
})
