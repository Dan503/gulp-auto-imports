import * as gulp from 'gulp'
import getSourceFiles from './core/helpers/getSourceFiles'
import {
	CreateAutoImportTaskProps,
	GetTaskNamesProps,
	GetTaskNamesReturn,
	GulpTask,
	WatchTask,
} from './createAutoImportTask.types'
import autoImports from './index'

/** last portion of sourceFolder after the last "/" */
const getName = (sourceFolder: string): string => {
	const regexMatch = /.*\/(.+)$/.exec(sourceFolder) || []
	return regexMatch[1] || ''
}

const getTaskNames = ({
	fileExtension = 'all-files',
	name,
	taskPrefix,
}: GetTaskNamesProps): GetTaskNamesReturn => {
	const prefix = (taskPrefix ? `${taskPrefix}:` : '') + fileExtension
	return {
		taskName: `${prefix}:auto-imports:${name}`,
		watchName: `${prefix}:watch-auto-imports:${name}`,
	}
}

export const createAutoImportTask = ({
	sourceFolder,
	fileExtension,
	taskPrefix,
	ignoreCharacter,
	ignoreImporterFile,
	importerSettings,
}: CreateAutoImportTaskProps): [GulpTask, WatchTask] => {
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

	interface Tasks {
		[taskName: string]: GulpTask | WatchTask
	}

	const tasks: Tasks = {
		[taskName]: (): NodeJS.ReadWriteStream =>
			gulp
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
				.pipe(gulp.dest(fullImporterSettings.dest)),
	}

	tasks[watchName] = (done: () => void): void => {
		const watcher = gulp.watch(
			getSourceFiles({
				sourceFolder,
				fileExtension,
				ignoreCharacter,
				ignoreImporterFile,
				importerFile: fullImporterSettings.fileName,
			})
		)
		watcher.on('add', gulp.series(tasks[taskName]))
		watcher.on('unlink', gulp.series(tasks[taskName]))
		done()
	}

	return [tasks[taskName] as GulpTask, tasks[watchName] as WatchTask]
}
