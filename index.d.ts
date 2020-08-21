/** Auto generate import-only files for any file type. SCSS, JS, Pug, whatever you want. */
const autoImports = (options: {
	/**
	 * Determines where the output file is sent after processing.
	 *
	 * Should be identical to the setting used in `gulp.dest()`.
	 *
	 * It is always a relative path from `gulpfile.js`, not a relative path from the current file.
	 *
	 * @example 'path/to/destination'
	 *
	 * @abstract The `gulp.dest()` setting is unavailable at the time the plugin is called, thus the setting needs to be provided explicitly.
	 */
	dest: string

	/**
	 * Use a set of predefined default settings rather than configuring all of the settings yourself.
	 *
	 * You can view the available presets and the settings that they provide in the presets folder.
	 *
	 * @variation es5 - Import a set of functions using `require()` and then call them on page load
	 *
	 * @variation es5_default_exports - `exports.$name = require('$path')`
	 *
	 * @variation es5_named_exports - `exports.$name = require('$path').$name`
	 *
	 * @variation es6 - Import a set of functions using ES6 `import` syntax and then call them on page load
	 *
	 * @variation es6_default_exports - `export { default as $name } from '$path'`
	 *
	 * @variation es6_named_exports - `export { $name } from '$path'`
	 *
	 * @variation jade - `include $path` (outputs a .jade file)
	 *
	 * @variation pug - `include $path` (outputs a .pug file)
	 *
	 * @variation sass - `@import $path` (outputs a .sass file)
	 *
	 * @variation scss - `@import '$path';` (outputs a .scss file)
	 *
	 * @variation stylus - `@import '$path'` (outputs a .styl file)
	 */
	preset?:
	| 'es5'
	| 'es5_default_exports'
	| 'es5_named_exports'
	| 'es6'
	| 'es6_default_exports'
	| 'es6_named_exports'
	| 'jade'
	| 'pug'
	| 'sass'
	| 'scss'
	| 'stylus'

	/**
	 * The format setting dictates the format of each import line in the generated file.
	 *
	 * Use the `$path` and `$name` placeholders inside the string to determine where the file path and name should go.
	 *
	 * @example "export { $name } from '$path'"
	 * @example {
		imports: `import $name from '$path'`,
		functions: '  $name()',
	},
	 * @requires template (only if an object is provided)
	 */
	format: string | {
		[formatName: string]: string
	}

	/**
	 * The template setting holds a string that dictates the overall structure of the generated file.
	 *
	 * Use `$format[formatName]` placeholders in the template string to dictate where each format should be used in the output file.
	 *
	 * If the format setting is provided as a string, the template setting is ignored.
	 *
	 * **Do not place format string indents in this setting**, place them in the `format` setting instead.
	 *
	 * @example `
		$format[imports]
	
		export default function () {
		$format[functions]
		}
	 * `
	 */
	template?: string

	/**
	 * Define the file name for the output file.
	 *
	 * The file extension must be included.
	 *
	 * @example "custom-file-name.js"
	 */
	fileName?: string

	/**
	 * `false` by default.
	 *
	 * When `true`, it will never alter the order that imports are loaded in.
	 *
	 * This gives you the ability to manually edit the output file to achieve the desired import order.
	 *
	 * Make sure to save the output file into source control so that your teammates end up with a file that is in the same order as yours.
	 */
	retainOrder?: boolean = false

	/**
	 * A string of text that is added to the top of the output file when it is generated.
	 *
	 * @example "// Do not edit this file directly".
	 */
	header?: string

	/**
	 * A string of text that is added to the bottom of the output file when it is generated.
	 *
	 * This might be useful for calling a custom function at the bottom of the file after all the imports have been loaded.
	 */
	footer?: string
}): NodeJS.ReadWriteStream => { }

export default autoImports