
var path = require('path');

var err = require('../helpers/err');
var path_error = require('../error-messages/$path');

function format_path (spec) {
  // Node 4.0.0 does not support destructuring :(
  // spec = { regEx, relativePath, format, isAbsolute, dest, slashStyle }
  var pathCount = (spec.format.match(spec.regEx) || []).length;
  err(pathCount > 1, path_error);
  var absolutePath = path.resolve('./', spec.dest, spec.relativePath);
  var chosenPath = spec.isAbsolute ? absolutePath : spec.relativePath;
  var slashes = /[\/\\]+/g;
  var finalPath = spec.slashStyle ? chosenPath.replace(slashes, spec.slashStyle) : chosenPath;
  var finalFormat = spec.format.replace(spec.regEx, finalPath);
  return finalFormat;
}

module.exports = function (relativePath, initialFormat, dest) {

  var formatters = [
    {
      type: 'relative-forward-slash',
      regEx: /\$path/g,
      isAbsolute: false,
      slashStyle: '/',
    }, {
      type: 'relative-back-slash',
      regEx: /\$_path/g,
      isAbsolute: false,
      slashStyle: '\\',
    }, {
      type: 'relative-escaped-back-slash',
      regEx: /\$\\\\path/g,
      isAbsolute: false,
      slashStyle: '\\\\',
    },

    {
      type: 'absolute-auto',
      regEx: /\$absolute/g,
      isAbsolute: true,
    }, {
      type: 'absolute-forward-slash',
      regEx: /\$\/absolute/g,
      isAbsolute: true,
      slashStyle: '/',
    }, {
      type: 'absolute-back-slash',
      regEx: /\$_absolute/g,
      isAbsolute: true,
      slashStyle: '\\',
    }, {
      type: 'absolute-escaped-back-slash',
      regEx: /\$\\\\absolute/g,
      isAbsolute: true,
      slashStyle: '\\\\',
    }
  ];

  var finalFormat = formatters.reduce((progressiveFormat, formatter) => {
    return format_path({
      regEx: formatter.regEx,
      relativePath: relativePath,
      format: progressiveFormat,
      isAbsolute: formatter.isAbsolute,
      dest: dest,
      slashStyle: formatter.slashStyle,
    })
  }, initialFormat);

  return finalFormat;
}
