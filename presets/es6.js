
var template = `
$format[imports]

export default function(){
$format[functions]
}
`;

module.exports = {
  format: {
    imports: 'import $name from "$path";',
    functions: '  $name();'
  },
  fileName: 'file-loader.js',
  template
}
