
// Template slash test

REM Relative path forward [default]
REM $path
cd ./test/js/js-input/one.js
cd ./test/js/js-input/two.js
cd ./other-test-folder/js/one.js
cd ./other-test-folder/js/two.js

REM Relative path back
REM $\_path
cd .\test\js\js-input\one.js
cd .\test\js\js-input\two.js
cd .\other-test-folder\js\one.js
cd .\other-test-folder\js\two.js

REM Relative path double back
REM $\\path
cd $\path
cd $\path
cd $\path
cd $\path

REM Absolute path auto [OS decides direction]
REM $absolute
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\one.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\two.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\one.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\two.js

REM Absolute path forced forward slashes
REM $/absolute
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/test/js/js-input/one.js
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/test/js/js-input/two.js
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/other-test-folder/js/one.js
cd C:/Users/Administrator/C Projects/C-npm/gulp-file-loader/tests/other-test-folder/js/two.js

REM Absolute path forced back slashes
REM $\_absolute
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\one.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\test\js\js-input\two.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\one.js
cd C:\Users\Administrator\C Projects\C-npm\gulp-file-loader\tests\other-test-folder\js\two.js

REM Absolute path forced double slashes
REM $\\absolute
cd $\absolute
cd $\absolute
cd $\absolute
cd $\absolute
