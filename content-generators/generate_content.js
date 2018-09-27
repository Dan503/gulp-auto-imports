
var isString = require('../helpers/isString');

var format_paths = require('../formatters/format_paths');
var format_template = require('../formatters/format_template');

module.exports = function generate_content ({ pathsArray, opt }) {

	var formatIsString = isString(opt.format);

	var output = formatIsString ?
		format_paths(pathsArray, opt.format) :
		format_template(pathsArray, opt.format, opt.template);

	var defaultHeadFoot = formatIsString ? '\n' : '';

	var header = opt.header ? `\n${opt.header}\n` : defaultHeadFoot;
	var footer = opt.footer ? `\n${opt.footer}\n` : defaultHeadFoot;

	return header + output + footer;
}
