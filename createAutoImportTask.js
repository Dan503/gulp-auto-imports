const gulp = require('gulp')

/** last portion of sourceFolder after the last "/" */
const getName = (sourceFolder) => /.*\/(.+)$/.exec(sourceFolder)[1]

const getTaskNames = ({ fileExtension, name }) => ({
	taskName: `${fileExtension}:auto-imports:${name}`,
	watchName: `${fileExtension}:watch-auto-imports:${name}`,
})

const ext = (fileExtension) => (fileExtension ? `.${fileExtension}` : '')

const getSourceFiles = ({ sourceFolder, fileExtension }) => [
	`${sourceFolder}/**/*${ext(fileExtension)}`,
	// Ignore files and folders that start with an underscore
	`!${sourceFolder}/{**/_*,**/_*/**}`,
]

const createWatcher = ({
	watchName,
	sourceFolder,
	fileExtension,
	taskName,
}) => {
	gulp.task(watchName, (done) => {
		const watcher = gulp.watch(`${sourceFolder}/**/*${ext(fileExtension)}`)
		watcher.on('add', gulp.series(taskName))
		watcher.on('unlink', gulp.series(taskName))
		done()
	})
}

const createAutoImportTask = ({
	sourceFolder,
	fileExtension,
	importerSettings,
}) => {
	const name = getName(sourceFolder)
	const { taskName, watchName } = getTaskNames({
		fileExtension,
		name,
	})

	gulp.task(taskName, () => {
		// Do not leave off the "return", it is vital!
		return gulp
			.src(getSourceFiles({ sourceFolder, fileExtension }))
			.pipe(autoImports(importerSettings))
			.pipe(gulp.dest(settings.dest))
	})

	createWatcher({ sourceFolder, fileExtension, watchName, taskName })

	return [taskName, watchName]
}

module.exports = createAutoImportTask
