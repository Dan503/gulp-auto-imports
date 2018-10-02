
var path = require('path');

var err = require('../helpers/err');
var path_error = require('../error-messages/$path');

function format_path (spec) {
  // Node 4.0.0 does not support destructuring :(
  // spec = { regEx, relativePath, format, isAbsolute, dest }
  var pathCount = (spec.format.match(spec.regEx) || []).length;
  err(pathCount > 1, path_error);
  var absolutePath = path.resolve('./', spec.dest, spec.relativePath);
  var chosenPath = spec.isAbsolute ? absolutePath : spec.relativePath;
  var finalFormat = spec.format.replace(spec.regEx, chosenPath);
  return finalFormat;
}

module.exports = function (relativePath, initialFormat, dest) {

  var formatters = [
    {
      type: 'relative',
      regEx: /\$path/g,
      isAbsolute: false,
    },
    {
      type: 'absolute',
      regEx: /\$absolute/g,
      isAbsolute: true,
    }
  ];

  var finalFormat = formatters.reduce((progressiveFormat, formatter) => {
    return format_path({
      regEx: formatter.regEx,
      relativePath: relativePath,
      format: progressiveFormat,
      isAbsolute: formatter.isAbsolute,
      dest: dest
    })
  }, initialFormat);

  return finalFormat;
}
