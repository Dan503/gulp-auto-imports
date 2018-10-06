
var path = require('path');

var isString = require('../helpers/isString');

var get_paths_from_string = require('./get_paths_from_string');

var replace_slash = (stringPath, replacement) => stringPath.replace(/[\/\\]+/g, replacement);

module.exports = function get_ordered_paths ({ oldContent, newPaths, opt }) {

	if (!isString(opt.format)) {
		var formatNames = Object.keys(opt.format);
		var formatValues = Object.values(opt.format);
		var formatWithPath = formatValues.filter(value => /\$([_\\]*2)?(path|absolute)/.test(value));
	}

	var contains = (array, value) => array.indexOf(value) > -1;
	var oldOrderedPaths = get_paths_from_string(oldContent);

	console.log({oldOrderedPaths});
	console.log({newPaths});

	var newOrderedPaths = [];
	newPaths.forEach((filePath) => {
		var replace_absolute_slash = replacement => replace_slash(path.resolve(opt.dest, filePath), replacement);

		var pathTypes = [
			//relative
			replace_slash(filePath, '/'),
			replace_slash(filePath, '\\'),
			replace_slash(filePath, '\\\\'),

			//absolute
			replace_absolute_slash('/'),
			replace_absolute_slash('\\'),
			replace_absolute_slash('\\\\'),
		];

		console.log({filePath});
		console.log({pathTypes});

		var isFound = pathTypes.some(testPath => contains(oldOrderedPaths, testPath));

		if (!isFound) {
			newOrderedPaths.push(filePath);
		}
	});

	var ammendedPaths = oldOrderedPaths.concat(newOrderedPaths);

	var finalPaths = ammendedPaths.filter(path => {
		return contains(newPaths, path);
	});

	return finalPaths;
}
