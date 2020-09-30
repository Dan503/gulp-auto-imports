import { options } from './index'

declare const createAutoImportTask: (props: {
	/**
	 * The folder holding the files for this import task.
	 *
	 * If you have multiple folders, create a separate task
	 * for each folder or target a shared common folder instead.
	 */
	sourceFolder: string
	/**
	 * The file extension for the type of files you want to target.
	 *
	 * Leave undefined to target all files inside the source folder
	 */
	fileExtension?: string
	/**
	 * The exact same object that you would normally pass
	 * into the `autoImports()` gulp plugin
	 */
	importerSettings: options
}) => returnValue

/**
 * The return value will return an array of two strings.
 *
 * The first value will always be the name of the main gulp auto-imports task.
 *
 * The second value will always be the name of the import task watcher.
 *
 * Use this pattern when creating your task names:
 *
 * ```js
 * const [ jsAutoImports, jsAutoImportsWatcher ] = createAutoImportsTask({
 *  sourceFolder: './src/js-folder',
 *  fileExtension: 'js', // optional
 *  importerSettings: { preset: 'js', dest: 'build' }
 *  hasWatcher: true // optional
 * })
 * ```
 */
type returnValue = [importerTaskName, watchTaskName]

type importerTaskName = string
type watchTaskName = string

export default createAutoImportTask
