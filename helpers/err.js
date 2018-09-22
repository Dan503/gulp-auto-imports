
module.exports = function err(condition, message) {
  if (condition) {
    throw new Error('gulp-file-loader: ' + message);
  }
}
