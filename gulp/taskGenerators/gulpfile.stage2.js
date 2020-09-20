var gulp = require('gulp')
require('./output/generate-task')

gulp.task('default', gulp.series('generate'))
