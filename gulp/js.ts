import * as gulp from 'gulp'
import autoImports from '../index'

const template = `
// This file is generated by gulp-auto-imports.
// Do not edit this file.
// Do not save this file into source control.

$format[imports]

export default function () {
$format[functions]
}
`

gulp.task('js:load', function () {
   const dest = 'tests/test/js'

   return gulp
      .src(['./tests/test/js/**/*.js', './tests/other-test-folder/js/**/*.js'])
      .pipe(
         autoImports({
            format: {
               imports: `import $name from '$path'`,
               functions: '  $name()',
            },
            //needed so that relative paths are able to be generated properly
            dest: dest,
            fileName: 'auto-imports.js',
            retainOrder: true,
            template,
         })
      )
      .pipe(gulp.dest(dest))
})

gulp.task('js', gulp.series('js:load'))

gulp.task('js:watch', function (done) {
   gulp.watch(
      ['./tests/test/js/**/*.js', './tests/other-test-folder/js/**/*.js'],
      gulp.series('js')
   )
   done()
})
