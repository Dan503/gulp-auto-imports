
var through = require('through2');

module.exports = function() {
  return through.obj(function(file, encoding, callback) {
    callback(null, doSomethingWithTheFile(file));
  });
};
