// This file auto-generates the types definition for the `preset` setting in index.d.ts
var gulp = require('gulp')
var autoImports = require('../../../index')
var { header } = require('../common')

var template = `
export type preset =
$format[typeDefinitions]
`

gulp.task('preset_types_generator', function () {
	var dest = '../../'

	return gulp
		.src('../../presets/*.js')
		.pipe(
			autoImports({
				format: {
					typeDefinitions: "  | '$name'",
				},
				dest,
				fileName: 'preset-types.ts',
				template,
				header,
			}),
		)
		.pipe(gulp.dest(dest))
})
