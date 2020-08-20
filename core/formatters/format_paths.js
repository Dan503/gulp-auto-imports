var formatPath = require("./formatPath");
var formatName = require("./formatName");
var Unique_Set = require("../helpers/Unique_Set");

module.exports = function format_paths(relativePaths, format) {
  var uniqueSet = new Unique_Set();
  var formattedPaths = relativePaths.map((filePath) => {
    var step_1_pathFormatted = formatPath(filePath, format);
    var step_2_nameFormatted = formatName(
      filePath,
      step_1_pathFormatted,
      uniqueSet
    );
    return step_2_nameFormatted;
  });
  return formattedPaths.join("\n");
};
