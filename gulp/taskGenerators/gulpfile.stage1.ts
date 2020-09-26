// Stage 1 prepares a gulp file that stage 2 is able to run
import * as gulp from 'gulp'
import autoImports from '../../index'

import { header } from './common'


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
				fileName: 'generate-task.ts',
				template,
				header,
			}),
		)
		.pipe(gulp.dest(dest))
})
