var gulp = require('gulp')

require('./gulp/js')
require('./gulp/scss')
require('./gulp/placeholder-tests')
// File is auto-generated
require('./gulp/taskGenerators/output/preset-test-tasks')

// Use `npm run start`, not `gulp`
gulp.task(
	'default',
	gulp.series(
		gulp.parallel('js', 'sass', 'multi-output-test', 'placeholder-tests'),
		'presets',
	),
)

gulp.task('watch', gulp.parallel('default', 'js:watch', 'sass:watch'))
