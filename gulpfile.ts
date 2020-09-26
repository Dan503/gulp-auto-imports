import * as gulp from 'gulp'
import './gulp/js'
import './gulp/scss'

// File is auto-generated
import './gulp/taskGenerators/output/preset-test-tasks'

// Use `npm run start`, not `gulp`
gulp.task(
	'default',
	gulp.series(gulp.parallel('js', 'sass', 'multi-output-test'), 'presets'),
)

gulp.task('watch', gulp.parallel('default', 'js:watch', 'sass:watch'))
