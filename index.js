'use strict';

/*
  Based on the code used in Gulp Concat
  This is just to help get me started
  https://github.com/gulp-community/gulp-concat/blob/master/index.js
*/

var path = require('path');
var through = require('through2');
var relative = require('relative');

var Unique_Set = require('./helpers/Unique_Set');

function err(condition, message) {
  if (condition) {
    throw new Error('gulp-file-loader: ' + message);
  }
}

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
    newFile.path = join(latestFile.base, opt.fileName);

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

function format_paths(relativePaths, format) {
  var uniqueSet = new Unique_Set();
  var formattedPaths = relativePaths.map(filePath => {
    var step_1_pathFormatted = formatPath(filePath, format);
    var step_2_nameFormatted = formatName(filePath, step_1_pathFormatted, uniqueSet);
    return step_2_nameFormatted;
  });
  return formattedPaths.join('\n');
}

function format_template(relativePaths, formats, template) {
  err(!template, 'The "template" setting is required if "format" is an object');

  var newTemplate = template;

  for (var type in formats) {
    var format = formats[type];
    var formatSet = format_paths(relativePaths, format);
    var placeholder = new RegExp(`\\$format\\[${type}\\]`,'g');
    newTemplate = newTemplate.replace(placeholder, formatSet);
  }

  return newTemplate;
}

function formatPath (filePath, format) {
  return format.replace(/\$path/g, filePath);
}

function formatName (filePath, format, uniqueSet) {
  var ext = path.extname(filePath);
  var name = path.basename(filePath, ext);
  var safeName = name.replace(/\W/g,'_');
  var uniqueName = uniqueSet.add(safeName);
  return format.replace(/\$name/g, uniqueName);
}


function get_relative_path(file, dest) {
  var from = slash( join(file.cwd, dest) );
  var to = slash(file.history[0]);
  var relativePath = slash( relative(from, to) );
  var relFixDots = relativePath.replace(/^(\.\.?)/, '$1/');
  var relDotSlash = relFixDots.replace(/^([^.\/])/, './$1');
  var relDupesRemoved = relDotSlash.replace(/\/\//g, '/');

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
