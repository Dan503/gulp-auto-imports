
var gulp = require('gulp');
var fileLoader = require('../index');

var template = `
// Template slash test

:: Relative path forward [default]
:: $path
$format[relForward]

:: Relative path back
:: $\\_path
$format[relBack]

:: Relative path double back
:: $\\\\path
$format[relDoubleBack]

:: Absolute path auto [OS decides direction]
:: $absolute
$format[absAuto]

:: Absolute path forced forward slashes
:: $/absolute
$format[absForward]

:: Absolute path forced back slashes
:: $\\_absolute
$format[absBack]

:: Absolute path forced double slashes
:: $\\\\absolute
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
