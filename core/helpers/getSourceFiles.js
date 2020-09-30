module.exports = function getSourceFiles({
	sourceFolder,
	fileExtension,
	ignoreCharacter,
}) {
	var ignoredCharacter = ignoreCharacter || '_'
	return [
		`${sourceFolder}/**/*${ext(fileExtension)}`,
		// Ignore files and folders that start with an the ignore character
		ignoredCharacter &&
			`!${sourceFolder}/{**/${ignoredCharacter}*,**/${ignoredCharacter}*/**}`,
	].filter(Boolean)
}

function ext(fileExtension) {
	return fileExtension ? `.${fileExtension}` : ''
}
