
module.exports = function create_file (inspirationFile, opt, newContent) {

	//Creates a new file based on the old one
	var newFile = inspirationFile.clone({contents: false});

	//Sets the new file name
	newFile.path = join([inspirationFile.base, opt.fileName]);

	newFile.contents = new Buffer(newContent, "utf-8");

	return newFile;
}
