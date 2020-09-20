// Generates the file that holds the js object full of js preset data
// This gulp task essentially teaches the gulp plugin how to handle the `preset` setting
var gulp = require('gulp')
var autoImports = require('../../../index')
var { header } = require('../common')

var template = `
var presets = {
$format[names]
}

module.exports = presets;
`

gulp.task('preset_imports_generator', function () {
	var dest = '../../core/content-generators'

	return gulp
		.src('../../presets/*.js')
		.pipe(
			autoImports({
				format: {
					names: '  $name: require("$path"),',
				},
				dest,
				fileName: 'preset-settings.js',
				template,
				header,
			}),
		)
		.pipe(gulp.dest(dest))
})
