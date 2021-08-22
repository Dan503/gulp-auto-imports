const del = require('del')

;(async () => {
	const deletedJsAndDts = await del(['*.js', '*.d.ts'])
	console.log('Deleted files:\n', deletedJsAndDts.join('\n '))
})()
