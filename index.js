'use strict';

/*
  Based on the code used in Gulp Concat
  This is just to help get me started
  https://github.com/gulp-community/gulp-concat/blob/master/index.js
*/

var through = require('through2');
var path = require('path');
var File = require('vinyl');
var Concat = require('concat-with-sourcemaps');

// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function(file, opt) {
  if (!file) {
    throw new Error('gulp-concat: Missing file option');
  }
  opt = opt || {};

  // to preserve existing |undefined| behaviour and to introduce |newLine: ""| for binaries
  if (typeof opt.newLine !== 'string') {
    opt.newLine = '\n';
  }

  var latestFile;
  var latestMod;
  var fileName;
  var concat;

  if (typeof file === 'string') {
    fileName = file;
  } else if (typeof file.path === 'string') {
    fileName = path.basename(file.path);
  } else {
    throw new Error('gulp-concat: Missing path in file options');
  }

  function bufferContents(file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // It doesn't support streams
    if (file.isStream()) {
      this.emit('error', new Error('gulp-concat: Streaming not supported'));
      cb();
      return;
    }

    // set latest file if not already set,
    // or if the current file was modified more recently.
    if (!latestMod || file.stat && file.stat.mtime > latestMod) {
      latestFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    // construct concat instance
    if (!concat) {
      concat = new Concat(false, fileName, opt.newLine);
    }

    // add file to concat instance
    concat.add(file.relative, file.contents);
    cb();
  }

  function endStream(cb) {
    // no files passed in, no file goes out
    if (!latestFile || !concat) {
      cb();
      return;
    }

    var joinedFile;

    // if file opt was a file path
    // clone everything from the latest file
    if (typeof file === 'string') {
      joinedFile = latestFile.clone({contents: false});
      joinedFile.path = path.join(latestFile.base, file);
    } else {
      joinedFile = new File(file);
    }

    joinedFile.contents = concat.content;

    this.push(joinedFile);
    cb();
  }

  return through.obj(bufferContents, endStream);
};
