
var gulp = require('gulp');

require('./gulp/js');
require('./gulp/scss');
require('./gulp/pug');
require('./gulp/generate-preset-loader');
require('./gulp/preset-tasks');

gulp.task('default', [
	'js',
	'sass',
	'pug',
	'preset-loader',
	'multi-output-test'
], ()=> {
	gulp.start('presets');
});

gulp.task('watch', ['default', 'js:watch', 'sass:watch', 'pug:watch']);
