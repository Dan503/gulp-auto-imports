var header = `
// This file is generated by gulp-auto-imports.
// Do not edit this file.
// Do not save this file into source control.`

module.exports = {
	format: `exports.$name = require('$path')`,
	fileName: 'auto-imports.js',
	header: header,
}