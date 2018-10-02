
// Template slash test

:: Relative path forward [default]
:: $path
cd ./test/js/js-input/one.js
cd ./test/js/js-input/two.js
cd ./other-test-folder/js/one.js
cd ./other-test-folder/js/two.js

:: Relative path back
:: $\_path
cd .\test\js\js-input\one.js
cd .\test\js\js-input\two.js
cd .\other-test-folder\js\one.js
cd .\other-test-folder\js\two.js

:: Relative path double back
:: $\\path
cd .\\test\\js\\js-input\\one.js
cd .\\test\\js\\js-input\\two.js
cd .\\other-test-folder\\js\\one.js
cd .\\other-test-folder\\js\\two.js

:: Absolute path auto [OS decides direction]
:: $absolute
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\one.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\two.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\one.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\two.js

:: Absolute path forced forward slashes
:: $/absolute
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/test/js/js-input/one.js
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/test/js/js-input/two.js
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/other-test-folder/js/one.js
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/other-test-folder/js/two.js

:: Absolute path forced back slashes
:: $\_absolute
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\one.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\two.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\one.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\two.js

:: Absolute path forced double slashes
:: $\\absolute
cd C:\\Users\\Administrator\\C Projects\\C-npm\\gulp-file-loader\\tests\\test\\js\\js-input\\one.js
cd C:\\Users\\Administrator\\C Projects\\C-npm\\gulp-file-loader\\tests\\test\\js\\js-input\\two.js
cd C:\\Users\\Administrator\\C Projects\\C-npm\\gulp-file-loader\\tests\\other-test-folder\\js\\one.js
cd C:\\Users\\Administrator\\C Projects\\C-npm\\gulp-file-loader\\tests\\other-test-folder\\js\\two.js
