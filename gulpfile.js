var gulp = require('gulp')

require('./gulp/js')
require('./gulp/scss')
require('./gulp/pug')
require('./gulp/generate-preset-loader')
require('./gulp/preset-tasks')

gulp.task(
	'default',
	gulp.series(
		gulp.parallel(
			'js',
			'sass',
			'pug',
			'preset-loader',
			'multi-output-test',
		),
		'presets',
	),
)

gulp.task(
	'watch',
	gulp.parallel('default', 'js:watch', 'sass:watch', 'pug:watch'),
)
