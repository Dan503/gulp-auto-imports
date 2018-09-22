
var gulp = require('gulp');

var fileLoader = require('./index');


gulp.task('default', function(){
	return gulp.src([
		'./test/scss/**/*.scss',
		'./other-test-folder/scss/**/*.scss'
	])
		.pipe(fileLoader('all.scss', {
			format: '@import "$path";',
			//needed so that relative paths are able to be generated properly
			dest: 'test/scss',
			outputFile: 'file-loader.scss'
		}))
		.pipe(gulp.dest('test/scss'))
})
