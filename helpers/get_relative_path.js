
var relative = require('relative');

var slash = require('./slash');
var join = require('./join');

module.exports = function get_relative_path(file, dest) {
  var from = slash( join([file.cwd, dest]) );
  var to = slash(file.history[0]);
  var relativePath = slash( relative(from, to) );
  var relFixDots = relativePath.replace(/^(\.\.?)/, '$1/');
  var relDotSlash = relFixDots.replace(/^([^.\/])/, './$1');
  var relDupesRemoved = relDotSlash.replace(/\/\//g, '/');

  return relDupesRemoved;
}
