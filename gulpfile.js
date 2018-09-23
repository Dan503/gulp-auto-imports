
var gulp = require('gulp');
var sass = require('gulp-sass');

var fileLoader = require('./index');

var template = `
$format[imports]

export default function(){
$format[functions]
}
`;

gulp.task('sass', ['sass:load'], function(){
	return gulp.src('./test/scss/main.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./test/css'));
});

gulp.task('sass:load', function(){

	var dest = 'test/scss';

	return gulp.src([
		'./test/scss/scss-input/**/*.scss',
		'./other-test-folder/scss/**/*.scss'
	])
		.pipe(fileLoader({
			format: '@import "$path";',
			// format: {
			// 	imports: 'import $name from "$path";',
			// 	functions: '  $name();'
			// },
			//needed so that relative paths are able to be generated properly
			dest: dest,
			fileName: 'file-loader.scss',
			template
		}))
		.pipe(gulp.dest(dest))
})

gulp.task('sass:watch', function () {
  gulp.watch([
		'./test/scss/scss-input/**/*.scss',
		'./other-test-folder/scss/**/*.scss'
	], ['sass']);
});

gulp.task('default', ['sass', 'sass:watch']);
