
var isString = require('../helpers/isString');

var format_paths = require('../formatters/format_paths');
var format_template = require('../formatters/format_template');

module.exports = function generate_content ({ pathsArray, opt }) {

	var output = isString(opt.format) ?
		format_paths(pathsArray, opt.format) :
		format_template(pathsArray, opt.format, opt.template);

	var header = opt.header ? `\n${opt.header}\n` : '\n';
	var footer = opt.footer ? `\n${opt.footer}\n` : '\n';

	return header + output + footer;
}
