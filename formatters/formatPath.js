
var err = require('../helpers/err');

module.exports = function formatPath (filePath, format) {
  var regEx = /\$path/g;
  var pathCount = (format.match(regEx) || []).length;
  err(pathCount > 1, '"$path" can only be declared once per format rule');
  return format.replace(regEx, filePath);
}
