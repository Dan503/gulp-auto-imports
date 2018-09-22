
var err = require('../helpers/err');
var format_paths = require('./format_paths');

module.exports = function format_template(relativePaths, formats, template) {
  err(!template, 'The "template" setting is required if "format" is an object');

  var newTemplate = template;

  for (var type in formats) {
    var format = formats[type];
    var formatSet = format_paths(relativePaths, format);
    var placeholder = new RegExp(`\\$format\\[${type}\\]`,'g');
    newTemplate = newTemplate.replace(placeholder, formatSet);
  }

  return newTemplate;
}
