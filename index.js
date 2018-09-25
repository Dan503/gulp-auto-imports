'use strict';

/*
  Loosely based on the code used in Gulp Concat
  https://github.com/gulp-community/gulp-concat/blob/master/index.js
*/

// npm
var through = require('through2');
var fileExists = require('file-exists');
var fs = require('fs');

// helpers
var err = require('./helpers/err');
var log = require('./helpers/log');
var get_relative_path = require('./helpers/get_relative_path');
var join = require('./helpers/join');
var get_paths_from_string = require('./helpers/get_paths_from_string');
var arrays_match = require('./helpers/arrays_match');

// formatters
var format_paths = require('./formatters/format_paths');
var format_template = require('./formatters/format_template');

var isString = string => typeof string === 'string';

module.exports = function(opt) {
  err(!opt.fileName, '"fileName" option is required (file name given to the final output file)')
  err(!opt.format, '"format" option is required. (format of each import line in the generated file)')
  err(!opt.dest, '"dest" option is required. (Should be the same as the gulp.dest() value)')

  var lastFile;
  var latestMod;
  var generatedFilePath = join([opt.dest, opt.fileName]);

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
      lastFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    relativePaths.push(get_relative_path(file, opt.dest));

    done();
  }

  function endStream(done) {

    // no files passed in, no file goes out
    if (!lastFile) {
      return done();
    }

    var generate_file = () => {
      log(`Generating ${opt.fileName}`);
      var newFile = create_file(lastFile, opt);
      this.push(newFile);
      done();
    }

    fileExists(generatedFilePath, (error, exists) => {
      err(error, error);
      if (exists) {
        read_file();
      } else {
        generate_file();
      }
    })

    function read_file() {
      fs.readFile(generatedFilePath, (error, data) => {
        if(error) throw error;
        var content = data.toString();

        var oldPaths = get_paths_from_string(content);

        if (arrays_match(relativePaths, oldPaths)) {
          //Skip file generation
          done();
        } else {
          generate_file();
        }
      })
    }
  }

  return through.obj(bufferContents, endStream);


  function create_file (inspirationFile, opt) {

    //Creates a new file based on the old one
    var newFile = inspirationFile.clone({contents: false});

    //Sets the new file name
    newFile.path = join([inspirationFile.base, opt.fileName]);

    var fileContent = isString(opt.format) ?
      format_paths(relativePaths, opt.format) :
      format_template(relativePaths, opt.format, opt.template);

    newFile.contents = new Buffer(fileContent, "utf-8");

    return newFile;
  }

};
