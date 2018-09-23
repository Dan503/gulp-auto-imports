'use strict';

/*
  Loosely based on the code used in Gulp Concat
  https://github.com/gulp-community/gulp-concat/blob/master/index.js
*/

// npm
var through = require('through2');

// helpers
var err = require('./helpers/err');
var get_relative_path = require('./helpers/get_relative_path');
var join = require('./helpers/join');

// formatters
var format_paths = require('./formatters/format_paths');
var format_template = require('./formatters/format_template');

var isString = string => typeof string === 'string';

module.exports = function(opt) {
  err(!opt.fileName, '"fileName" option is required (file name given to the final output file)')
  err(!opt.format, '"format" option is required. (format of each import line in the generated file)')
  err(!opt.dest, '"dest" option is required. (Should be the same as the gulp.dest() value)')

  var latestFile;
  var latestMod;

  var relativePaths = [];

  function bufferContents(file, enc, done) {
    // ignore empty files
    if (file.isNull()) {
      return done();
    }

    // It doesn't support streams
    if (file.isStream()) {
      this.emit('error', new Error('gulp-file-loader: Streaming not supported'));
      done();
      return;
    }

    // set latest file if not already set,
    // or if the current file was modified more recently.
    if (!latestMod || file.stat && file.stat.mtime > latestMod) {
      latestFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    relativePaths.push(get_relative_path(file, opt.dest));

    done();
  }

  function endStream(done) {

    // no files passed in, no file goes out
    if (!latestFile) {
      return done();
    }

    //Creates a new file based on the old one
    var newFile = latestFile.clone({contents: false});

    //Sets the new file name
    newFile.path = join([latestFile.base, opt.fileName]);

    var fileContent = isString(opt.format) ?
      format_paths(relativePaths, opt.format) :
      format_template(relativePaths, opt.format, opt.template);

    //Adds the content to the file
    newFile.contents =  new Buffer(fileContent, "utf-8");

    this.push(newFile);
    done();
  }

  return through.obj(bufferContents, endStream);
};



