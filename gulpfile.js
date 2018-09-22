
var gulp = require('gulp');

var fileLoader = require('./index');

gulp.task('default', function(){
	return gulp.src([
		'./test/scss/scss-input/**/*.scss',
		'./other-test-folder/scss/**/*.scss'
	])
		// .pipe(fileLoader({
		// 	format: '@import "$path";',
		// 	//needed so that paths are able to be generated effectively
		// 	outputFile: 'file-loader.scss',
		// }))
		.pipe(fileLoader('all.scss'))
		.pipe(gulp.dest('./test/scss'))
})
