
var gulp = require('gulp');

require('./gulp/js');
require('./gulp/scss');
require('./gulp/pug');

gulp.task('default', ['js', 'sass', 'pug']);

gulp.task('watch', ['default', 'js:watch', 'sass:watch', 'pug:watch']);
