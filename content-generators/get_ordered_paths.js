
var get_paths_from_string = require('./get_paths_from_string');

module.exports = function get_ordered_paths ({ oldContent, newPaths }) {

	var contains = (array, value) => array.indexOf(value) > -1;
	var oldOrderedPaths = get_paths_from_string(oldContent);

	var newOrderedPaths = newPaths.reduce((result, path) => {
		if (!contains(oldOrderedPaths, path)) result.push(path);
	}, []);

	var finalPaths = oldOrderedPaths.concat(newOrderedPaths);
	return finalPaths;
}
