// This file auto-generates the types definition for the `preset` setting in index.d.ts
import * as gulp from 'gulp'
import autoImports from '../../../index'

import { header } from '../common'

const template = `
export type preset =
$format[typeDefinitions]
`

gulp.task('preset_types_generator', function () {
   const dest = '../../'

   return gulp
      .src('../../presets/*.js')
      .pipe(
         autoImports({
            format: {
               typeDefinitions: "	| '$name'",
            },
            dest,
            fileName: 'preset-types.ts',
            template,
            header,
         })
      )
      .pipe(gulp.dest(dest))
})
