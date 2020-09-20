var c = require('chalk')

module.exports = {
	$pathError: `"${c.cyan(
		'$path',
	)}" can only be declared once per format rule.`,
	$noExtPathError: `"${c.cyan(
		'$noExtPath',
	)}" can only be declared once per format rule.`,
}
