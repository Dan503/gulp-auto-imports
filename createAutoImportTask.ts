import * as gulp from 'gulp'
import getSourceFiles from './core/helpers/getSourceFiles'
import {
	CreateAutoImportTaskProps,
	returnValue,
} from './createAutoImportTask.types'
import autoImports from './index'

/** last portion of sourceFolder after the last "/" */
const getName = (sourceFolder: string): string => {
	return /.*\/(.+)$/.exec(sourceFolder)[1] || ''
}

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
	ignoreImporterFile,
	importerFile,
}) => {
	gulp.task(watchName, done => {
		const watcher = gulp.watch(
			getSourceFiles({
				sourceFolder,
				fileExtension,
				ignoreCharacter,
				ignoreImporterFile,
				importerFile,
			})
		)
		watcher.on('add', gulp.series(taskName))
		watcher.on('unlink', gulp.series(taskName))
		done()
	})
}

const createAutoImportTask = ({
	sourceFolder,
	watch = true,
	fileExtension,
	taskPrefix,
	ignoreCharacter,
	ignoreImporterFile,
	importerSettings,
}: CreateAutoImportTaskProps): returnValue => {
	const defaultSettings = importerSettings.preset
		? require(`./presets/${importerSettings.preset}`)
		: {}

	const fullImporterSettings = {
		dest: sourceFolder,
		...defaultSettings,
		...importerSettings,
	}

	const name = getName(sourceFolder)
	const { taskName, watchName } = getTaskNames({
		fileExtension,
		name,
		taskPrefix,
	})

	gulp.task(taskName, () => {
		return gulp
			.src(
				getSourceFiles({
					sourceFolder,
					fileExtension,
					ignoreCharacter,
					ignoreImporterFile,
					importerFile: fullImporterSettings.fileName,
				})
			)
			.pipe(autoImports(fullImporterSettings))
			.pipe(gulp.dest(fullImporterSettings.dest))
	})

	if (watch) {
		createWatcher({
			sourceFolder,
			fileExtension,
			watchName,
			taskName,
			ignoreCharacter,
			ignoreImporterFile,
			importerFile: fullImporterSettings.fileName,
		})

		return [taskName, watchName]
	} else {
		return taskName
	}
}

export default createAutoImportTask
