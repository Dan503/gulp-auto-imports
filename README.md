# Gulp File Loader

_Auto generate import only files for any file type. scss, js, pug, whatever you want._

[![node](https://img.shields.io/node/v/gulp-file-loader?style=for-the-badge)](https://nodejs.org/en/)

![Depfu](https://img.shields.io/depfu/depfu/gulp-file-loader?style=for-the-badge)

Are you sick of having to manually manage scss files that look like this?

```scss
@import "../components/component-A/A.scss";
@import "../components/component-B/B.scss";
@import "../components/component-C/C.scss";
@import "../components/component-D/D.scss";
```

Or Javascript files that look like this? (excuse the jQuery)

```js
import $ from 'jquery';

import A from "../components/component-A/A.js";
import B from "../components/component-B/B.js";
import C from "../components/component-C/C.js";
import D from "../components/component-D/D.js";

$(() => {
  A();
  B();
  C();
  D();
})
```

Wouldn't it be easier if Gulp could just look at your file system and manage this busy work for you?

That is where Gulp File Loader comes in. Gulp file loader will automatically manage these import only files for you giving you more time to worry about the important stuff.

Due to it's high level of customization Gulp File Loader is able to generate any import file you can imagine. SCSS, JS, Pug, PHP, you name it, it can create an import file for it (assuming the language has import functionality).

## Set up

Install Gulp File Loader using the following command:

```
npm install gulp-file-loader --save-dev
```

For my examples, I am assuming a folder structure that looks like this:

```
[root]
  source
  |  components
  |  |  [component folders]
  |  |  |  [component files]
  |  js
  |  |  file-loader.js
  |  |  main.js
  |  scss
  |  |  config
  |  |  |  [scss config files]
  |  |  file-loader.scss
  |  |  main.scss
  build
  |  assets
  |  |  css
  |  |  |  main.css
```


### Basic SCSS set up

I'll use SCSS as an example first because it's simple and popular. You will need the Gulp Sass plugin for this to work
(`npm i gulp-sass -D`)

Create a gulp task that looks like this:

```js
var gulp = require('gulp');
var fileLoader = require('gulp-file-loader');

gulp.task('sass:load', function(){

  var dest = './source/scss';

  // Do not leave off the "return", it is vital!
  return gulp.src([
    // These paths are always relative to gulpfile.js
    './source/scss/config/**/*.scss', // These will be loaded first
    './source/components/**/*.scss' // These will be loaded second
  ])
    .pipe(fileLoader({
      // "$path" is replaced with a relative file path
      format: '@import "$path";',
      dest: dest,
      fileName: 'file-loader.scss',
    }))
    .pipe(gulp.dest(dest))
  })

})
```

The output of this Gulp task will look something like this:

```scss
// generated file-loader.scss file
@import "./config/A.scss";
@import "./config/B.scss";
@import "../components/one/one.scss";
@import "../components/two/two.scss";
```

Now in your main sass compile task, require "sass:load" as a dependent task of your main sass compile task like so:

```js
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', ['sass:load'], function(){
  return gulp.src('./scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/assets/css'));
});
```

Finally add this line to your main scss file (or make file-loader.scss your main scss file instead if you prefer):

```scss
// Import the file-loader.scss file from main.scss
@import "./file-loader.scss";
```

You can now auto-load you're component scss files :)

**Warning:** CSS is highly dependent on the order that rules appear in. Gulp File Loader currently does not allow the order that imports appear in to be altered. This is however a feature planned for a future release.

#### Gulp 4

If you are using Gulp 4, the set-up will look more like this:

```js
var gulp = require('gulp');
var sass = require('gulp-sass');
var fileLoader = require('gulp-file-loader');

gulp.task('sass:load', function(){
  var dest = './source/scss';
  return gulp.src([
    './source/scss/config/**/*.scss',
    './source/components/**/*.scss'
  ])
    .pipe(fileLoader({
      format: '@import "$path";',
      dest: dest,
      fileName: 'file-loader.scss',
    }))
    .pipe(gulp.dest(dest))
  })
})

// ['sass:load'] removed from sass compile task
gulp.task('sass:compile', function(){
  return gulp.src('./scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/assets/css'));
});

// The main sass task uses gulp.series to
// ensure that 'sass:load' runs before 'sass:compile'
gulp.task('sass', gulp.series('sass:load', 'sass:compile'))
```

## Basic JS set up

JS is slightly more complicated.

A typical file loader gulp task for JS looks like this:

```js
var gulp = require('gulp');
var fileLoader = require('gulp-file-loader');

// Use an ES6 template literal for defining the template
// Node has supported them natively ever since 4.0.0
var template = `
$format[imports]

export default function(){
$format[functions]
}
`;

gulp.task('js:load', function(){

  var dest = './source/js';

  return gulp.src('./source/components/**/*.js')
    .pipe(fileLoader({
      // format is now split into an object
      format: {
        // "$name" is replaced with the name of the file
        imports: 'import $name from "$path";',
        functions: '  $name();'
      },
      dest: dest,
      fileName: 'file-loader.js',
      template: template
    }))
    .pipe(gulp.dest(dest))
  })

})
```

The output from this task will look something like this:

```js
// generated file-loader.js file
import one from "../components/one/one.js";
import two from "../components/two/two.js";
import three from "../components/three/three.js";
import four from "../components/four/four.js";

export default function(){
  one();
  two();
  three();
  four();
}
```

You then require the file-loader task as a dependent task for your main js compiler task.

```js
gulp.task('js', ['js:load'], function(){
  //code for compiling JS
});
```

Depending on how your unique gulp set up looks, this may not be the best way to do it. The main point is that this task must complete before the main.js file is compiled. If you want to squeeze out more performance, it only needs to run if there are either new files added to the system or if files have been removed from the system. I might add this as an automated feature in the future but for now it runs every time it is called.

Now that Gulp is set up, import your generated file from main.js and call it as a function.

```js
// main.js file

import $ from 'jquery';

import fileLoader from './file-loader.js'

$(() => {
  fileLoader();
})
```

## Understanding format and the template

Use an ES6 Template Literal (the back tick style strings) for creating the template. Remember that Template Literal's count all white space literally, so any white space you add to the template will appear in the final output. To avoid an odd looking output file, save the template to a `template` variable outside of the gulp task so that there is no indentation to the side of it.

The template works by replacing each `$format[formatName]` statement with a full list of imports formated in the specified format given in the `format` object.

If the format is provided as a string, the template is ignored. If it is provided as an object, a template is required.

### $name

`$name` in the `format` setting is replaced with the file name of the file. Any non-alphabetic and non-numeric characters are converted to underscores to prevent possible syntax errors.

```
./folder/path/gulp-file-loader-is-awesome-123!.js

 ===  converts to $name ===

gulp_file_loader_is_awesome_123_
```
If there are duplicate file names, a number is added to the end of the name based on how many duplicates it has found so far to ensure that each name is unique.

### $path

`$path` in the `format` setting is replaced with a relative path from the file-loader file to the file being loaded in.

```
$path = ./path/to/file.ext
```

## Other settings

- **fileName** = The file name for the output file
- **dest** = Should be identical to the setting used in `gulp.dest`. It determines where the output file is sent after processing. The `gulp.dest` setting is unavailable at the time the plugin is called, thus the setting needs to be provided explicitly.
