
var err = require('../helpers/err');
var path_error = require('../error-messages/$path');

module.exports = function formatPath (filePath, format) {
  var regEx = /\$path/g;
  var pathCount = (format.match(regEx) || []).length;
  err(pathCount > 1, path_error);
  return format.replace(regEx, filePath);
}
