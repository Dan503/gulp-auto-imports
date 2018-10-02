
// Template slash test

:: Relative path forward [default]
:: $path
cd ./test/js/js-input/one.js :://\\inline slashes test
cd ./test/js/js-input/two.js :://\\inline slashes test
cd ./other-test-folder/js/one.js :://\\inline slashes test
cd ./other-test-folder/js/two.js :://\\inline slashes test

:: Relative path back
:: $\_path
cd .\test\js\js-input\one.js :://\\inline slashes test
cd .\test\js\js-input\two.js :://\\inline slashes test
cd .\other-test-folder\js\one.js :://\\inline slashes test
cd .\other-test-folder\js\two.js :://\\inline slashes test

:: Relative path double back
:: $\\path
cd .\\test\\js\\js-input\\one.js :://\\inline slashes test
cd .\\test\\js\\js-input\\two.js :://\\inline slashes test
cd .\\other-test-folder\\js\\one.js :://\\inline slashes test
cd .\\other-test-folder\\js\\two.js :://\\inline slashes test

:: Absolute path auto [OS decides direction]
:: $absolute
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\one.js :://\\inline slashes test
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\two.js :://\\inline slashes test
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\one.js :://\\inline slashes test
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\two.js :://\\inline slashes test

:: Absolute path forced forward slashes
:: $/absolute
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/test/js/js-input/one.js :://\\inline slashes test
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/test/js/js-input/two.js :://\\inline slashes test
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/other-test-folder/js/one.js :://\\inline slashes test
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/other-test-folder/js/two.js :://\\inline slashes test

:: Absolute path forced back slashes
:: $\_absolute
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\one.js :://\\inline slashes test
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\two.js :://\\inline slashes test
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\one.js :://\\inline slashes test
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\two.js :://\\inline slashes test

:: Absolute path forced double slashes
:: $\\absolute
cd C:\\Users\\Administrator\\C Projects\\C-npm\\gulp-file-loader\\tests\\test\\js\\js-input\\one.js :://\\inline slashes test
cd C:\\Users\\Administrator\\C Projects\\C-npm\\gulp-file-loader\\tests\\test\\js\\js-input\\two.js :://\\inline slashes test
cd C:\\Users\\Administrator\\C Projects\\C-npm\\gulp-file-loader\\tests\\other-test-folder\\js\\one.js :://\\inline slashes test
cd C:\\Users\\Administrator\\C Projects\\C-npm\\gulp-file-loader\\tests\\other-test-folder\\js\\two.js :://\\inline slashes test
