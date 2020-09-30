var gulp = require('gulp')
var createAutoImportTask = require('../createAutoImportTask')

const createPlaceholderTest = (placholder) => {
	return createAutoImportTask({
		sourceFolder: 'tests/input/test',
		taskPrefix: `${placholder}-placeholder`,
		importerSettings: {
			dest: 'tests/placholder-tests-output',
			format: `${placholder} | $fileName.$ext`,
			fileName: `${placholder}.test.txt`,
		},
	})
}

const [$name] = createPlaceholderTest('$name')
const [$ext] = createPlaceholderTest('$ext')
const [$path] = createPlaceholderTest('$path')
const [$noExtPath] = createPlaceholderTest('$noExtPath')
const [$dir] = createPlaceholderTest('$dir')

gulp.task(
	'placeholder-tests',
	gulp.parallel($name, $ext, $path, $noExtPath, $dir),
)
