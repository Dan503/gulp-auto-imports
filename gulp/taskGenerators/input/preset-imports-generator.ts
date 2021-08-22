// Generates the file that holds the js object full of js preset data
// This gulp task essentially teaches the gulp plugin how to handle the `preset` setting
import * as gulp from 'gulp'
import autoImports from '../../../index'

import { header } from '../common'

const template = `
var presets = {
$format[names]
}

module.exports = presets
`

gulp.task('preset_imports_generator', function () {
   const dest = '../../core/content-generators'

   return gulp
      .src('../../presets/*.js')
      .pipe(
         autoImports({
            format: {
               names: `	$name: require('$path'),`,
            },
            dest,
            fileName: 'preset-settings.js',
            template,
            header,
         })
      )
      .pipe(gulp.dest(dest))
})
