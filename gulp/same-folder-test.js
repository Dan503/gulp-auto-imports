var gulp = require('gulp')
var createAutoImportTask = require('../createAutoImportTask')

const [sameFolderTest] = createAutoImportTask({
	sourceFolder: 'tests/same-folder-test',
	fileExtension: 'js',
	importerSettings: {
		dest: 'tests/same-folder-test',
		preset: 'es6',
		fileName: `sameFolderOutput.test.js`,
	},
})

gulp.task('same-folder-test', gulp.parallel(sameFolderTest))
