var path = require('path')
var err = require('../helpers/err')
var pathError = require('../error-messages/$path')

module.exports = function formatPath(filePath, format) {
	var pathObj = path.parse(filePath)
	var noExtPath = [pathObj.dir, pathObj.name].join('/')

	var pathRegEx = /\$path/g
	var noExtPathRegEx = /\$noExtPath/g
	var dirRegEx = /\$dir/g
	var pathCount = (format.match(pathRegEx) || []).length
	var noExtPathCount = (format.match(noExtPathRegEx) || []).length
	var dirCount = (format.match(dirRegEx) || []).length
	err(pathCount + noExtPathCount + dirCount > 1, pathError)
	return format
		.replace(pathRegEx, filePath)
		.replace(noExtPathRegEx, noExtPath)
		.replace(dirRegEx, pathObj.dir)
}
