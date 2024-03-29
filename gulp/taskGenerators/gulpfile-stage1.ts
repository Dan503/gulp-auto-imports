// Stage 1 prepares a gulp file that stage 2 is able to run
import * as gulp from 'gulp'
import getSourceFiles from '../../core/helpers/getSourceFiles'
import autoImports from '../../index'

import { header } from './common'

const template = `
var gulp = require('gulp')
$format[imports]

gulp.task(
	'generate',
	gulp.parallel(
$format[names]
	)
)
`

export default function () {
   const dest = 'output'

   return gulp
      .src(getSourceFiles({ sourceFolder: './input', fileExtension: 'js' }))
      .pipe(
         autoImports({
            format: {
               imports: `require('$path')`,
               names: `		'$name',`,
            },
            dest,
            fileName: 'generate-task.ts',
            template,
            header,
         })
      )
      .pipe(gulp.dest(dest))
}
