// Stage 2 takes the gulp file that stage 1 generated and runs it
// The default gulp file in the root directory is essentially stage 3
var gulp = require('gulp')
require('./output/generate-task')

gulp.task('default', gulp.series('generate'))
