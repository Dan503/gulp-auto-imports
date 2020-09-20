var gulp = require('gulp')

require('./gulp/js')
require('./gulp/scss')
require('./gulp/pug')
require('./gulp/taskGenerators/output/preset-test-tasks')

gulp.task(
	'default',
	gulp.series(
		gulp.parallel('js', 'sass', 'pug', 'multi-output-test'),
		'presets',
	),
)

gulp.task(
	'watch',
	gulp.parallel('default', 'js:watch', 'sass:watch', 'pug:watch'),
)
