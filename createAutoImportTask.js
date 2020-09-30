const gulp = require('gulp')

/** last portion of sourceFolder after the last "/" */
const getName = (sourceFolder) => /.*\/(.+)$/.exec(sourceFolder)[1]

const getTaskNames = ({ fileExtension, name, hasWatcher }) => ({
	taskName: `${fileExtension}:auto-exports:${name}`,
	watchName: hasWatcher ? `${fileExtension}:watch:${name}` : undefined,
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
	hasWatcher = true,
}) => {
	const name = getName(sourceFolder)
	const { taskName, watchName } = getTaskNames({
		fileExtension,
		name,
		hasWatcher,
	})

	gulp.task(taskName, () => {
		// Do not leave off the "return", it is vital!
		return gulp
			.src(getSourceFiles({ sourceFolder, fileExtension }))
			.pipe(autoImports(importerSettings))
			.pipe(gulp.dest(settings.dest))
	})

	if (hasWatcher) {
		createWatcher({ sourceFolder, fileExtension, watchName, taskName })
	}

	return [taskName, watchName]
}

module.exports = createAutoImportTask
