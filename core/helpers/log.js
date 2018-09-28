
var c = require('chalk');

module.exports = function log (message) {
	console.log(`${c.green('gulp-file-loader:')} ${message}`);
}
