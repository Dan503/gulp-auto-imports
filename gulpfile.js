
var gulp = require('gulp');

require('./gulp/js');
require('./gulp/scss');

gulp.task('build', ['js', 'sass']);

gulp.task('default', ['js', 'sass', 'js:watch', 'sass:watch']);
