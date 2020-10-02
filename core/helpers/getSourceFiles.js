module.exports = function getSourceFiles({
	sourceFolder,
	fileExtension,
	ignoreCharacter = '#',
	ignoreImporterFile = true,
	importerFile = `auto-imports.${fileExtension}`,
}) {
	const getSrc = (src) => `${src}/**/*${ext(fileExtension)}`
	const sourceIsArray = Array.isArray(sourceFolder)
	const source = sourceIsArray
		? sourceFolder.map(getSrc)
		: [getSrc(sourceFolder)]
	const sourceDirs = sourceIsArray ? sourceFolder : [sourceFolder]
	const ignoredPaths = ignoreCharacter
		? sourceDirs.map((src) => {
				// Ignore files and folders that start with the ignore character
				return `!${src}/{**/${ignoreCharacter}*,**/${ignoreCharacter}*/**}`
		  })
		: []
	return [
		...source,
		...ignoredPaths,
		ignoreImporterFile && `!${importerFile}`,
	].filter(Boolean)
}

function ext(fileExtension) {
	return fileExtension ? `.${fileExtension}` : ''
}
