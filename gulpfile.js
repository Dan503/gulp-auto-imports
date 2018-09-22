
var gulp = require('gulp');

var fileLoader = require('./index');

var template = `
$format[imports]

export default function(){
$format[functions]
}
`;

gulp.task('default', function(){

	var dest = 'test/scss';

	return gulp.src([
		'./test/scss/scss-input/**/*.scss',
		'./other-test-folder/scss/**/*.scss'
	])
		.pipe(fileLoader({
			// format: 'import $name from "$path";',
			format: {
				imports: 'import $name from "$path";',
				functions: '  $name();'
			},
			//needed so that relative paths are able to be generated properly
			dest: dest,
			fileName: 'file-loader.js',
			template
		}))
		.pipe(gulp.dest(dest))
})
