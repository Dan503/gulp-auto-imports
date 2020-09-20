var gulp = require('gulp')
var autoImports = require('../../index')
var { header } = require('./common')

var template = `
var gulp = require('gulp')
$format[imports]

gulp.task('generate', gulp.parallel(
$format[names]
))
`

gulp.task('default', function () {
	var dest = 'output'

	return gulp
		.src('./input/*.js')
		.pipe(
			autoImports({
				format: {
					imports: `require('$path')`,
					names: `  '$name',`,
				},
				dest,
				fileName: 'generate-task.js',
				template,
				header,
			}),
		)
		.pipe(gulp.dest(dest))
})
