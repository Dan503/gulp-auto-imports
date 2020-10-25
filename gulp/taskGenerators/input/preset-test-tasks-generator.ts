// This file is used to generate the gulp tasks that test that the presets are working
import * as gulp from 'gulp'
import autoImports from '../../../index'

import { header } from '../common'

const template = `
import * as gulp from 'gulp'
import autoImports from '../../../index'
import getSourceFiles from '../../../core/helpers/getSourceFiles'

const dest = 'tests/output/preset-outputs'

$format[gulpTask]

gulp.task('presets', gulp.parallel(
$format[taskName]
))
`

const taskFormat = `
gulp.task('preset:$name', function () {
	return gulp
		.src(getSourceFiles({
			sourceFolder: [
				'./tests/input/test/{ext}',
				'./tests/input/other-test-folder/{ext}',
			],
			fileExtension: '{ext}',
		}))
		.pipe(
			autoImports({
				preset: '$name',
				dest: dest,
				fileName: 'preset-$name.{ext}',
			}),
		)
		.pipe(gulp.dest(dest))
})
`

let getExtension = (fileName: string) => {
	if (/^es5/.test(fileName) || /^es6/.test(fileName)) {
		return 'js'
	}
	if (/^ts/.test(fileName)) {
		return 'ts'
	}
	if (fileName === 'stylus') {
		return 'styl'
	}
	return fileName
}

gulp.task('preset_test_tasks_generator', function () {
	let dest = './output'

	return gulp
		.src('../../presets/*.js')
		.pipe(
			autoImports({
				format: {
					gulpTask: taskFormat,
					taskName: `  'preset:$name',`,
				},
				dest,
				fileName: 'preset-test-tasks.ts',
				template,
				header,
				formatReplace: ({ output, path }) => {
					return output.replace(/{ext}/g, getExtension(path.name))
				},
			})
		)
		.pipe(gulp.dest(dest))
})
