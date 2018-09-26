
var isString = require('../helpers/isString');

var format_paths = require('../formatters/format_paths');
var format_template = require('../formatters/format_template');

module.exports = function generate_content ({ pathsArray, opt }) {
	return isString(opt.format) ?
		format_paths(pathsArray, opt.format) :
		format_template(pathsArray, opt.format, opt.template);
}
