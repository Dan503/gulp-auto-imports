
var get_paths_from_string = require('./get_paths_from_string');

module.exports = function get_ordered_paths ({ oldContent, newPaths }) {

	var contains = (array, value) => array.indexOf(value) > -1;
	var oldOrderedPaths = get_paths_from_string(oldContent);

	if (oldOrderedPaths.length < 1) {
		return newPaths;
	}

	var newOrderedPaths = [].concat(oldOrderedPaths);
	newPaths.forEach((path) => {
		if (!contains(oldOrderedPaths, path)) {
			var matchingIndex = get_highest_index_match(path, oldOrderedPaths);
			newOrderedPaths.splice(matchingIndex + 1, 0, path);
		}
	});

	var finalPaths = newOrderedPaths.filter(path => {
		return contains(newPaths, path);
	});

	return finalPaths;
}

function get_highest_index_match(targetPath, comparisonArray) {
	var lineScores = comparisonArray.map(comparisonPath => compare_paths(targetPath, comparisonPath));
	var highestIndex = lineScores.reduce((highIndex, score, index) => {
		if (highIndex <= score) {
			highIndex = index;
		}
		return highIndex;
	}, 0)

	return highestIndex;
}

function compare_paths(targetPath, comparisonPath) {
	var targetArray = targetPath.split('');
	var comparisonArray = comparisonPath.split('');

	var i = 0;
	var compare = i => targetArray[i] == comparisonArray[i];
	var isDefined = i => typeof targetArray[i] !== 'undefined';
	while (isDefined(i) && compare(i)){
		i++;
	}

	return i;
}
