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
				if (ignoreImporterFile) {
					// Also ignores the file that ends up getting outputted by the plugin
					return `!${src}/{**/${ignoreCharacter}*,**/${ignoreCharacter}*/**,**/${importerFile}}`
				} else {
					return `!${src}/{**/${ignoreCharacter}*,**/${ignoreCharacter}*/**}`
				}
		  })
		: []
	return [...source, ...ignoredPaths]
}

function ext(fileExtension) {
	return fileExtension ? `.${fileExtension}` : ''
}
