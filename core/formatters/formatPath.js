var path = require('path')
var err = require('../helpers/err')
var { $pathError, $noExtPathError } = require('../error-messages/$path')

module.exports = function formatPath(filePath, format) {
	var pathObj = path.parse(filePath)
	var noExtPath = [pathObj.dir, pathObj.name].join('/')

	var pathRegEx = /\$path/g
	var noExtPathRegEx = /\$noExtPath/g
	var pathCount = (format.match(pathRegEx) || []).length
	var noExtPathCount = (format.match(noExtPathRegEx) || []).length
	err(pathCount > 1, $pathError)
	err(noExtPathCount > 1, $noExtPathError)
	return format
		.replace(pathRegEx, filePath)
		.replace(noExtPathRegEx, noExtPath)
}
