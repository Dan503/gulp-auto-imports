// Stage 2 takes the gulp file that stage 1 generated and runs it
// The default gulp file in the root directory is essentially stage 3
import * as gulp from 'gulp'

import './output/generate-task'

export default function (done: any) {
	return gulp.series('generate')(done)
}
