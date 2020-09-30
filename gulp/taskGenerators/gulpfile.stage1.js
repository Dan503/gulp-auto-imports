// Stage 1 prepares a gulp file that stage 2 is able to run
var gulp = require('gulp')
const getSourceFiles = require('../../core/helpers/getSourceFiles')
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
		.src(getSourceFiles({ sourceFolder: './input', fileExtension: 'js' }))
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
