'use strict';

/*
  Based on the code used in Gulp Concat
  This is just to help get me started
  https://github.com/gulp-community/gulp-concat/blob/master/index.js
*/

var fs = require('fs');
var through = require('through2');
var path = require('path');
var File = require('vinyl');
var Concat = require('concat-with-sourcemaps');
var relative = require('relative');

// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function(file, opt) {
  if (!file) {
    throw new Error('gulp-file-loader: Missing options');
  }

  // if (!opt.format) {
  //   throw new Error('gulp-file-loader: format option is required');
  // }

  // if (!opt.dest) {
  //   throw new Error('gulp-file-loader: dest option is required');
  // }

  opt = opt || {};

  var latestFile;
  var latestMod;
  var fileName;
  var concat;

  var relativePaths = [];

  // if (typeof file === 'string') {
  //   fileName = file;
  // } else if (typeof file.path === 'string') {
  //   fileName = path.basename(file.path);
  // } else {
  //   throw new Error('gulp-concat: Missing path in file options');
  // }

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

    relativePaths.push(get_relative_path(file, opt.dest));

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
      return cb();
    }

    var newFile = latestFile.clone({contents: false});

    //sets the new file name
    newFile.path = join(latestFile.base, file);

    var fileContent = relativePaths.join('\n');

    newFile.contents =  new Buffer(fileContent, "utf-8");

    this.push(newFile);
    cb();
  }

  return through.obj(bufferContents, endStream);
};

function get_relative_path(file, dest) {
  var from = slash( join(file.cwd, dest) );
  var to = slash(file.history[0]);
  var relativePath = slash( relative(from, to) );
  var relFixDots = relativePath.replace(/^(\.\.?)/, '$1/');
  var relDotSlash = relFixDots.replace(/^([^.\/])/, './$1');
  var relDupesRemoved = relDotSlash.replace(/\/\//g, '/');

  // console.log({ from, to, initial: relativePath, final: relDupesRemoved });

  return relDupesRemoved;
}

function slash(string){
  return string.replace(/\\/g,'/');
}

function debug(file) {
  var propValue;
  for(var propName in file) {
      propValue = file[propName];
      console.log(`{${propName}: ${propValue}}`);
  }
}

function join(...array){
  return slash(array.join('/'));
}
