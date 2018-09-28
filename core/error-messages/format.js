
var c = require('chalk');

module.exports =
`${c.yellow('"format"')} option is required.
${c.grey('This dictates the format of each import line in the generated file.')}

${c.bold('Example:')}
${c.yellow('format:')} "import ${c.magenta('$name')} from "${c.cyan('$path')}",

${c.magenta('$name')} = name of the file minus the extension (good for variable names)
${c.cyan('$path')} = relative path to the file`;
