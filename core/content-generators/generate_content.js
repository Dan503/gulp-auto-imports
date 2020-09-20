var isString = require("../helpers/isString");
var warn = require("../helpers/warn");

var template_warning = require("../error-messages/warn-template");

var format_paths = require("../formatters/format_paths");
var format_template = require("../formatters/format_template");
const createPathObj = require('../helpers/createPathObj');

module.exports = function generate_content({ pathsArray, opt }) {
  var formatIsString = isString(opt.format);

  warn(formatIsString && opt.template, template_warning);

  var output = formatIsString
    ? format_paths(pathsArray, opt.format, opt.formatReplace)
    : format_template(
        pathsArray,
        opt.format,
        opt.template,
        opt.formatReplace,
      )

  var defaultHeadFoot = formatIsString ? "\n" : "";

  var header = opt.header ? `${opt.header}\n` : defaultHeadFoot;
  var footer = opt.footer ? `\n${opt.footer}` : defaultHeadFoot;

  if (opt.templateReplace) {
    var paths = pathsArray.map(createPathObj)
    output = opt.templateReplace({ output, paths })
  }

  return header + output + footer;
};
