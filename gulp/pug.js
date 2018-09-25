
var gulp = require('gulp');
var fileLoader = require('../index');

gulp.task('pug:load', function(){

	var dest = 'test/pug';

	return gulp.src([
		'./test/pug/pug-input/**/*.pug',
		'./other-test-folder/pug/**/*.pug'
	])
		.pipe(fileLoader({
			format: 'include $path',
			//needed so that relative paths are able to be generated properly
			dest: dest,
			fileName: 'file-loader.pug',
		}))
		.pipe(gulp.dest(dest))
})

gulp.task('pug', ['pug:load']);

gulp.task('pug:watch', function () {
  gulp.watch([
		'./test/pug/pug-input/**/*.pug',
		'./other-test-folder/pug/**/*.pug'
	], ['pug']);
});
