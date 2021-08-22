var gulp = require('gulp')
var { createAutoImportTask } = require('../createAutoImportTask')

const sourceFolder = 'tests/same-folder-test'

const preset = 'es6_default_exports'

const [withFileExtensionSetting] = createAutoImportTask({
   sourceFolder,
   fileExtension: 'js',
   taskPrefix: 'withExtension',
   importerSettings: {
      preset,
      fileName: `output-withFileExtensionSetting.test.js`,
   },
})
const [noFileExtensionSetting] = createAutoImportTask({
   sourceFolder,
   taskPrefix: 'noExtension',
   importerSettings: {
      preset,
      fileName: `output-noFileExtensionSetting.test.js`,
   },
})
const [defaultFileName] = createAutoImportTask({
   sourceFolder,
   taskPrefix: 'defaultFileName',
   importerSettings: {
      preset,
   },
})

gulp.task(
   'same-folder-test',
   gulp.series(
      withFileExtensionSetting,
      noFileExtensionSetting,
      defaultFileName
   )
)
