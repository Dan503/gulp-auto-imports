var header = `
// This file is generated by gulp-auto-imports.
// Do not edit this file.
// Do not save this file into source control.`

var template = `
$format[imports]

module.exports = function () {
$format[functions]
}
`

module.exports = {
   format: {
      imports: `var $name = require('$path')`,
      functions: '  $name()',
   },
   fileName: 'auto-imports.js',
   header: header,
   template: template,
}
