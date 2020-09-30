module.exports = function getSourceFiles({
	sourceFolder,
	fileExtension,
	ignoreCharacter,
}) {
	const getSrc = (src) => `${src}/**/*${ext(fileExtension)}`
	var source = Array.isArray(sourceFolder)
		? sourceFolder.map(getSrc)
		: [getSrc(sourceFolder)]
	var ignoredCharacter = ignoreCharacter || '_'
	return [
		...source,
		// Ignore files and folders that start with an the ignore character
		ignoredCharacter &&
			`!${sourceFolder}/{**/${ignoredCharacter}*,**/${ignoredCharacter}*/**}`,
	].filter(Boolean)
}

function ext(fileExtension) {
	return fileExtension ? `.${fileExtension}` : ''
}
