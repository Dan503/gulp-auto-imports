'use strict';

/*
  Loosely based on the code used in Gulp Concat
  https://github.com/gulp-community/gulp-concat/blob/master/index.js
*/

// npm
var through = require('through2');
var fileExists = require('file-exists');

// helpers
var err = require('./helpers/err');
var log = require('./helpers/log');
var join = require('./helpers/join');
var get_relative_path = require('./content-generators/get_relative_path');
var read_file = require('./file_manipulation/read_file');
var generate_content = require('./content-generators/generate_content');
var create_file = require('./file_manipulation/create_file');
var order_content = require('./content-generators/order_content');

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

    var generate_file = (content) => {
      var newFile = create_file(lastFile, opt, content);
      log(`Generated ${opt.fileName}`);
      this.push(newFile);
      done();
    }

    fileExists(generatedFilePath, (error, exists) => {
      err(error, error);
      if (exists) {
        read_file(generatedFilePath)
        .then( oldContent => {

          var orderedContent = opt.retainOrder ?
            order_content({ oldContent, newPaths: relativePaths, opt }) :
            generate_content({ pathsArray: relativePaths, opt });

          if (orderedContent === oldContent) {
            //Skip file generation
            done();
          } else {
            generate_file(orderedContent);
          }

        });
      } else {
        generate_file(newContent);
      }
    })


  }

  return through.obj(bufferContents, endStream);


};
