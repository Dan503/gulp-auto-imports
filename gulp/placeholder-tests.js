var gulp = require('gulp')
var { createAutoImportTask } = require('../createAutoImportTask')

const createPlaceholderTest = placholder => {
	return createAutoImportTask({
		sourceFolder: 'tests/input/test',
		taskPrefix: `${placholder}`,
		importerSettings: {
			dest: 'tests/placholder-tests-output',
			format: `${placholder} | $fileName.$ext`,
			fileName: `${placholder}.test.txt`,
		},
	})
}

gulp.task(
	'placeholder-tests',
	gulp.series(
		createPlaceholderTest('$name')[0],
		createPlaceholderTest('$fileName')[0],
		createPlaceholderTest('$ext')[0],
		createPlaceholderTest('$path')[0],
		createPlaceholderTest('$noExtPath')[0],
		createPlaceholderTest('$dir')[0]
	)
)
