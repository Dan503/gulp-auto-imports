
var gulp = require('gulp');

var fileLoader = require('./index');

gulp.task('default', function(){
	return gulp.src([
		'./test/scss/scss-input/**/*.scss',
		'./other-test/scss/**/*.scss'
	])
		.pipe(fileLoader({
			format: '@import "$path";',
			//needed so that paths are able to be generated effectively
			dest: './test/scss/file-loader.scss',
		}))
		.pipe(gulp.dest('./test/scss'))
})
