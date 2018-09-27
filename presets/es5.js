
var template = `
$format[imports]

module.exports = function(){
$format[functions]
}
`;

module.exports = {
  format: {
    imports: 'var $name = require("$path");',
    functions: '  $name();',
  },
  fileName: 'file-loader.js',
  template
}
