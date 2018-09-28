
var c = require('chalk');

module.exports = function err(condition, message) {
  if (condition) {
    console.log(`\n${c.red('gulp-file-loader error:')}\n${message}\n`);
    throw new Error('gulp-file-loader');
  }
}
