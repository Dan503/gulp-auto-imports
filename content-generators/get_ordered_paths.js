
var get_paths_from_string = require('./get_paths_from_string');

module.exports = function get_ordered_paths ({ oldContent, newPaths }) {

	var contains = (array, value) => array.indexOf(value) > -1;
	var oldOrderedPaths = get_paths_from_string(oldContent);

	var newOrderedPaths = [];
	newPaths.forEach((path) => {
		if (!contains(oldOrderedPaths, path)) {
			newOrderedPaths.push(path);
		}
	});

	var ammendedPaths = oldOrderedPaths.concat(newOrderedPaths);

	var finalPaths = ammendedPaths.filter(path => {
		return contains(newPaths, path);
	});

	return finalPaths;
}
