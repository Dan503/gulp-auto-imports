
var gulp = require('gulp');
var fileLoader = require('../index');

var template = `
// Template slash test

REM Relative path forward [default]
REM $path
$format[relForward]

REM Relative path back
REM $\\_path
$format[relBack]

REM Relative path double back
REM $\\\\path
$format[relDoubleBack]

REM Absolute path auto [OS decides direction]
REM $absolute
$format[absAuto]

REM Absolute path forced forward slashes
REM $/absolute
$format[absForward]

REM Absolute path forced back slashes
REM $\\_absolute
$format[absBack]

REM Absolute path forced double slashes
REM $\\\\absolute
$format[absDoubleBack]
`;

gulp.task('slashes', function(){

	var dest = 'tests';

	return gulp.src([
		'./tests/test/js/js-input/**/*.js',
		'./tests/other-test-folder/js/**/*.js'
	])
		.pipe(fileLoader({
			format: {
				relForward: 'cd $path',
				relBack: 'cd $\_path',
				relDoubleBack: 'cd $\\path',
				absAuto: 'cd $absolute',
				absForward: 'cd $/absolute',
				absBack: 'cd $\_absolute',
				absDoubleBack: 'cd $\\absolute',
			},
			dest: dest,
			fileName: 'slash-test.bat',
			template
		}))
		.pipe(gulp.dest(dest))

})
