var gulp = require('gulp')
var autoImports = require('../../../index')
var { header } = require('../common')

var template = `
var gulp = require('gulp')
var autoImports = require('../../../index')

var dest = 'tests/output/preset-outputs'

$format[gulpTask]

gulp.task('presets', gulp.parallel(
$format[taskName]
))
`

var taskFormat = `
gulp.task('preset:$name', function () {
	return gulp
		.src([
			'./tests/input/test/$name/**/*',
			'./tests/other-test-folder/$name/**/*',
		])
		.pipe(
			autoImports({
				preset: '$name',
				dest: dest,
				fileName: 'preset-$name.js',
			}),
		)
		.pipe(gulp.dest(dest))
})
`

gulp.task('preset_test_tasks_generator', function () {
	var dest = './output'

	return gulp
		.src('../../presets/*.js')
		.pipe(
			autoImports({
				format: {
					gulpTask: taskFormat,
					taskName: `  'preset:$name',`,
				},
				dest,
				fileName: 'preset-test-tasks.js',
				template,
				header,
			}),
		)
		.pipe(gulp.dest(dest))
})
