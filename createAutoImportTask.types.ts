import { options } from './index'

export interface CreateAutoImportTaskProps {
	/**
	 * The folder holding the files for this import task.
	 *
	 * If you have multiple folders, create a separate task
	 * for each folder or target a shared common folder instead.
	 */
	sourceFolder: string
	/**
	 * Set to `false` to prevent a watch task from being generated.
	 *
	 * If false, a single string will be returned instead of an array of strings.
	 *
	 * @default true
	 */
	watch?: boolean
	/**
	 * The file extension for the type of files you want to target.
	 *
	 * Leave undefined to target all files inside the source folder
	 */
	fileExtension?: string
	/**
	 * Files and folders that start with this string will be ignored
	 * @default "#"
	 */
	ignoreCharacter?: string
	/**
	 * Provide a unique string for helping identify the task.
	 *
	 * Typically not needed as the file extension and source folder are usually enough on their own.
	 */
	taskPrefix?: string
	/**
	 * Specify if the output file should be ignored.
	 * Useful if the output file is in the same directory as the input files.
	 * @default true
	 */
	ignoreImporterFile?: boolean
	/**
	 * The exact same object that you would normally pass
	 * into the `autoImports()` gulp plugin
	 */
	importerSettings: options
}

/**
 * The return value will return either an array of two strings or a single string
 * depending on if `watch` is true or not.
 *
 * **If `watch` is `true`** (default)
 *
 * An array with two strings will be returned.
 *
 * The first value will be the name of the main gulp auto-imports task.
 *
 * The second value will be the name of the import task watcher.
 *
 * Use this pattern when creating your task names:
 *
 * ```js
 * const [ jsAutoImports, jsAutoImportsWatcher ] = createAutoImportsTask({
 *  sourceFolder: './src/js-folder',
 *  fileExtension: 'js', // optional
 *  ignoreCharacter: 'X_', // optional
 *  importerSettings: { preset: 'js', dest: 'build' }
 * })
 * ```
 *
 * **If `watch` is `false`**
 *
 * Only the main gulp auto-imports task name will be returned as a single string.
 *
 * Use like this:
 * ```js
 * const jsAutoImports = createAutoImportsTask({
 *  watch: false,
 *  sourceFolder: './src/js-folder',
 *  fileExtension: 'js', // optional
 *  ignoreCharacter: 'X_', // optional
 *  importerSettings: { preset: 'js', dest: 'build' }
 * })
 * ```
 */
export type returnValue = importerTaskName | [importerTaskName, watchTaskName]

type importerTaskName = string
type watchTaskName = string
