
var err = require('../helpers/err');
var format_paths = require('./format_paths');

var template_error = require('../error-messages/template');

module.exports = function format_template(relativePaths, opt) {
  err(!opt.template, template_error);

  var newTemplate = opt.template;

  for (var type in opt.format) {
    var format = opt.format[type];
    var settings = Object.assign({}, opt, { format: format });
    var formatSet = format_paths(relativePaths, settings);
    var placeholder = new RegExp(`\\$format\\[${type}\\]`,'g');
    newTemplate = newTemplate.replace(placeholder, formatSet);
  }

  return newTemplate;
}
