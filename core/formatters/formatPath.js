var path = require('path')
var err = require('../helpers/err')
var pathError = require('../error-messages/$path')
const warn = require('../helpers/warn')
var c = require('chalk')

module.exports = function formatPath(filePath, format, options) {
	var pathObj = path.parse(filePath)
	var noExtPath = [pathObj.dir, pathObj.name].join('/')

	var pathRegEx = /\$path/g
	var noExtPathRegEx = /\$noExtPath/g
	var dirRegEx = /\$dir/g
	var pathCount = (format.match(pathRegEx) || []).length
	var noExtPathCount = (format.match(noExtPathRegEx) || []).length
	var dirCount = (format.match(dirRegEx) || []).length
	err(pathCount + noExtPathCount + dirCount > 1, pathError)

	warn(
		noExtPathCount > 0 && options.retainOrder,
		`\n\nThe ${c.yellow(
			'$noExtPath',
		)} placeholder does not support the ${c.cyan(
			'retainOrder: true',
		)} setting\n\n${c.bold('Format:')} ${format}\n\n${c.bold(
			'File path:',
		)} ${filePath}\n\n`,
	)

	return format
		.replace(pathRegEx, filePath)
		.replace(noExtPathRegEx, noExtPath)
		.replace(dirRegEx, pathObj.dir)
}
