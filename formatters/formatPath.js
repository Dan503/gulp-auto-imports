
module.exports = function formatPath (filePath, format) {
  return format.replace(/\$path/g, filePath);
}
