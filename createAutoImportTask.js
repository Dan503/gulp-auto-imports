const gulp = require('gulp')
const getSourceFiles = require('./core/helpers/getSourceFiles')
const autoImports = require('./index')

/** last portion of sourceFolder after the last "/" */
const getName = (sourceFolder) => /.*\/(.+)$/.exec(sourceFolder)[1]

const getTaskNames = ({ fileExtension = 'all-files', name, taskPrefix }) => {
	const prefix = (taskPrefix ? `${taskPrefix}:` : '') + fileExtension
	return {
		taskName: `${prefix}:auto-imports:${name}`,
		watchName: `${prefix}:watch-auto-imports:${name}`,
	}
}

const createWatcher = ({
	watchName,
	sourceFolder,
	fileExtension,
	taskName,
	ignoreCharacter,
}) => {
	gulp.task(watchName, (done) => {
		const watcher = gulp.watch(
			getSourceFiles({ sourceFolder, fileExtension, ignoreCharacter }),
		)
		watcher.on('add', gulp.series(taskName))
		watcher.on('unlink', gulp.series(taskName))
		done()
	})
}

const createAutoImportTask = ({
	sourceFolder,
	fileExtension,
	taskPrefix,
	ignoreCharacter = '_',
	importerSettings,
}) => {
	const name = getName(sourceFolder)
	const { taskName, watchName } = getTaskNames({
		fileExtension,
		name,
		taskPrefix,
	})

	gulp.task(taskName, () => {
		// Do not leave off the "return", it is vital!
		return gulp
			.src(
				getSourceFiles({
					sourceFolder,
					fileExtension,
					ignoreCharacter,
				}),
			)
			.pipe(autoImports(importerSettings))
			.pipe(gulp.dest(importerSettings.dest))
	})

	createWatcher({
		sourceFolder,
		fileExtension,
		watchName,
		taskName,
		ignoreCharacter,
	})

	return [taskName, watchName]
}

module.exports = createAutoImportTask
