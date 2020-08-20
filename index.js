'use strict'

/*
  Loosely based on the code used in Gulp Concat
  https://github.com/gulp-community/gulp-concat/blob/master/index.js
*/

// npm
var through = require('through2')
var fileExists = require('file-exists')
var c = require('chalk')

// helpers
var err = require('./core/helpers/err')
var log = require('./core/helpers/log')
var join = require('./core/helpers/join')
var get_relative_path = require('./core/content-generators/get_relative_path')
var read_file = require('./core/file_manipulation/read_file')
var generate_content = require('./core/content-generators/generate_content')
var create_file = require('./core/file_manipulation/create_file')
var order_content = require('./core/content-generators/order_content')

var presets = require('./core/content-generators/preset-settings')

var dest_error = require('./core/error-messages/dest')
var format_error = require('./core/error-messages/format')
var fileName_error = require('./core/error-messages/fileName')

module.exports = function (opt) {
	if (opt.preset) {
		opt = Object.assign({}, presets[opt.preset], opt)
	}

	err(!opt.fileName, fileName_error)
	err(!opt.format, format_error)
	err(!opt.dest, dest_error)

	var lastFile
	var latestMod
	var generatedFilePath = join([opt.dest, opt.fileName])

	var relativePaths = []

	function bufferContents(file, enc, done) {
		// ignore empty files
		if (file.isNull()) {
			return done()
		}

		// gulp-auto-imports doesn't support streams
		err(file.isStream(), 'Streaming is not supported')

		// set latest file if not already set,
		// or if the current file was modified more recently.
		if (!latestMod || (file.stat && file.stat.mtime > latestMod)) {
			lastFile = file
			latestMod = file.stat && file.stat.mtime
		}

		relativePaths.push(get_relative_path(file, opt.dest))

		done()
	}

	function endStream(done) {
		// no files passed in, no file goes out
		if (!lastFile) {
			return done()
		}

		var new_content = () =>
			generate_content({ pathsArray: relativePaths, opt })

		var generate_file = (content) => {
			var newFile = create_file(lastFile, opt, content)
			log(
				`Generated ${c.magenta(
					join([opt.dest, c.yellow(opt.fileName)]),
				)}`,
			)
			this.push(newFile)
			done()
		}

		fileExists(generatedFilePath, (error, exists) => {
			err(error, error)
			if (exists) {
				read_file(generatedFilePath).then((oldContent) => {
					var orderedContent = opt.retainOrder
						? order_content({
								oldContent,
								newPaths: relativePaths,
								opt,
						  })
						: new_content()

					if (orderedContent === oldContent) {
						//Skip file generation
						done()
					} else {
						generate_file(orderedContent)
					}
				})
			} else {
				generate_file(new_content())
			}
		})
	}

	return through.obj(bufferContents, endStream)
}
