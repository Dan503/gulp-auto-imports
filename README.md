# Gulp File Loader

_Auto generate import-only files for any file type. scss, js, pug, whatever you want._

[![Supported Node version](https://img.shields.io/node/v/gulp-file-loader.svg?style=for-the-badge)](https://nodejs.org/en/)

Are you sick of having to manually manage files that are purely just a bunch of import statements?

Wouldn't it be awesome if Gulp could just look at your file system and manage this busy work for you?

That is where Gulp File Loader comes in. Gulp File Loader will automatically manage these import-only files for you giving you more time to worry about the important stuff.

Due to it's high level of customization, Gulp File Loader is able to generate any import file you can imagine. SCSS, JS, Pug, PHP, you name it, it can create an import file for it (assuming the language supports import functionality in some way).


## Before and after Gulp File Loader <!-- omit in toc -->

### SCSS Before <!-- omit in toc -->

```scss
@import "../components/component-A/A.scss";
@import "../components/component-B/B.scss";
@import "../components/component-C/C.scss";
@import "../components/component-D/D.scss";
```

### SCSS After <!-- omit in toc -->

```scss
@import "./file-loader.scss";
```

### JS before <!-- omit in toc -->

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

### JS after <!-- omit in toc -->

```js
import $ from 'jquery';

import fileLoader from "./fileLoader.js";

$(() => {
  fileLoader();
})
```

## Contents <!-- omit in toc -->

- [Install](#install)
- [Manual SCSS set up](#manual-scss-set-up)
  - [Gulp 4 SCSS set up](#gulp-4-scss-set-up)
  - [The `retainOrder` setting](#the-retainorder-setting)
- [Manual JS set up](#manual-js-set-up)
- [Understanding the `format` and `template` settings](#understanding-the-format-and-template-settings)
  - [The `$name` placeholder](#the-name-placeholder)
  - [The `$path` placeholder](#the-path-placeholder)
  - [Using indents](#using-indents)
- [Preset shortcuts](#preset-shortcuts)
  - [Using a preset](#using-a-preset)
  - [Available presets](#available-presets)
  - [Overriding a preset](#overriding-a-preset)
- [Other settings](#other-settings)

## Install

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

## Manual SCSS set up

I'll use SCSS as an example first because it is both simple and popular. You will need the Gulp Sass plugin for this to work
(`npm i gulp-sass -D`)

Create a gulp task that looks like this:

```js
// Typical SCSS gulp-file-loader task

var gulp = require('gulp');
var fileLoader = require('gulp-file-loader');

gulp.task('sass:load', function(){

  var dest = './source/scss';

  // Do not leave off the "return", it is vital!
  return gulp.src([
    // These paths are always relative to gulpfile.js
    './source/scss/config/**/*.scss', // These files will be loaded first
    './source/components/**/*.scss' // These files will be loaded second
  ])
    .pipe(fileLoader({
      // "$path" is replaced with a relative file path
      format: '@import "$path";',
      dest: dest,
      fileName: 'file-loader.scss',
      retainOrder: true,
    }))
    .pipe(gulp.dest(dest))
  })

})
```

The output of this Gulp task will look something like this:

```scss
// Generated file-loader.scss file

@import "./config/A.scss";
@import "./config/B.scss";
@import "../components/one/one.scss";
@import "../components/two/two.scss";
```

Now in your main sass compile task, require `"sass:load"` as a dependent task of your main sass compile task like so:

```js
// Make the file-loader task a dependency of the main Sass task

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', ['sass:load'], function(){
  return gulp.src('./source/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/assets/css'));
});
```

Finally add this line to your main scss file:

```scss
// Import the file-loader.scss file from main.scss
@import "./file-loader.scss";
```

Alternatively you can make `file-loader.scss` your main scss file instead and skip that last step.

You can now auto-load you're component scss files! 😃

### Gulp 4 SCSS set up

If you are using Gulp 4, the set-up will look more like this:

```js
// Gulp 4 set up

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
      retainOrder: true,
    }))
    .pipe(gulp.dest(dest))
  })
})

// ['sass:load'] removed from sass compile task
gulp.task('sass:compile', function(){
  return gulp.src('./source/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/assets/css'));
});

// The main sass task uses gulp.series to
// ensure that 'sass:load' runs before 'sass:compile'
gulp.task('sass', gulp.series('sass:load', 'sass:compile'))
```

### The `retainOrder` setting

You may have noticed that I added a setting called `retainOrder`.

In CSS, the order that styles are written in matters significantly. It is important that you are able to alter the order that files are loaded in if you wish to have full control over your CSS specificity.

Other globing methods (eg. `@import "../path/to/components/**/*.scss";`) do not give you the ability to alter the order that the files are loaded in. You are generally restricted to loading files in alphabetical order. Gulp File Loader gives you back the ability to control the order your CSS loads in with it's `retainOrder` setting (introduced in v2.0.0).

By default `retainOrder` is set to `false`. When `retainOrder` is set to `true`, Gulp File Loader will not alter the order of the existing import paths if you manually edit them yourself. Make sure that if you enable the `retainOrder` setting you **save the output file into source control**. This will ensure that your co-workers don't end up with a CSS file that is in a different order to yours.

Gulp File Loader will still delete old files from the list that don't exist any more. It will also add any new files it finds to the bottom of the list. It will not retain any comments or other alterations to the file. It will only retain the order that the imports were announced in.

## Manual JS set up

JS is slightly more complicated.

```js
// Typical JS gulp-file-loader task

var gulp = require('gulp');
var fileLoader = require('gulp-file-loader');

// Use an ES6 template literal for defining the template
// Node has supported them natively ever since v4.0.0
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
      // Format is now split into an object
      format: {
        // "$name" is replaced with the name of the file
        imports: 'import $name from "$path";',
        // The indent is added here, not in the template
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
// Generated file-loader.js file

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
// Make the file-loader task a dependency of the main JS task

gulp.task('js', ['js:load'], function(){
  //code for compiling JS
});
```

Depending on how your unique gulp set up looks, this may not be the best way to do it. The main point is that the file-loader task _must_ be completed before the main.js file is compiled.

Now that Gulp is set up, import your generated file from main.js and call it as a function.

```js
// Import file-loader.js inside main.js

import $ from 'jquery';

import fileLoader from './file-loader.js'

$(() => {
  // Run the file-loader code on page load
  fileLoader();
})
```

Note that a typical component js file will need to export a function by default for this configuration to work.

```js
// component js file

export default function on_page_load() {
  // Place code here that you wish to run
  // when the `fileLoader()` function is called
}
```

## Understanding the `format` and `template` settings

It is recommended that you use an ES6 Template Literal (the back tick style strings) for creating the template rather than regular strings. Template Literals will allow you to define the markup found inside the output file exactly as written in a single string. Regular strings don't accept new lines so it makes writing the template much more difficult.

Remember that Template Literal's count all white space literally, so any white space you add to the template will appear in the final output. To avoid an odd looking output file, save the template to a `template` variable outside of the gulp task so that there is no indentation to the side of it.

The template works by replacing each `$format[formatName]` statement with a full list of imports formated in the specified way provided in the `format` object.

If the format is provided as a string, the template is ignored. If it is provided as an object, a template is required.

### The `$name` placeholder

The `$name` placeholder in the `format` setting is replaced with the file name of the file. Any non-alphabetic and non-numeric characters are converted to underscores to prevent possible syntax errors.

```
./folder/path/gulp-file-loader-is-awesome!123.js

 === converts to the $name ===

gulp_file_loader_is_awesome_123
```

If there are duplicate file names, a number is added to the end of the name based on how many duplicates it has found to ensure that each name is unique.

```
./folder/one/thing.js
./folder/two/thing.js

 === converts to the $name ===

thing
thing_1
```

The `$name` placeholder is excellent for use cases where you need to assign an import path to a variable name.

You can use the `$name` placeholder as much as you like. That includes having the `$name` placeholder appear multiple times in a single format rule. The `$name` will always refer to the same import path.

### The `$path` placeholder

The `$path` placeholder in the `format` setting is replaced with a relative path that goes from the file-loader output file to the file that is being loaded in.

```
$path = ./path/to/file.ext
```

`$path` can only be declared once per format rule.

### Using indents

If you want indenting, the **indenting should be added through the `format` setting** _not_ the `template` setting. If you indent the template, only the first item in the list will be indented. The rest will press hard up against the edge of the page.

For example, if you use this as your template:

```js
// How NOT to indent your template

var template = `
$format[imports]

export default function(){
    // Notice the indent here
    $format[functions]
}
`;

```

You will end up with a JS file that looks like this:

```js
// The result of incorrect indentation

import one from "../components/one/one.js";
import two from "../components/two/two.js";
import three from "../components/three/three.js";
import four from "../components/four/four.js";

export default function(){
    // Notice the indent here
    one();
two();
three();
four();
}
```

Instead, apply indentation through the `format` setting:

```js
//How to apply correct indentation

var template = `
$format[imports]

export default function(){
    // Notice the indent here
$format[functions]
}
`;

// ...

fileLoader({
  format: {
    imports: 'import $name from "$path";',
    // The indent is added here, not in the template
    functions: '    $name();'
  },
  dest: dest,
  fileName: 'file-loader.js',
  template: template
})
```

That will produce the desired output:

```js
// The result of correct indenting

import one from "../components/one/one.js";
import two from "../components/two/two.js";
import three from "../components/three/three.js";
import four from "../components/four/four.js";

export default function(){
    // Notice the indent here
    one();
    two();
    three();
    four();
}
```

## Preset shortcuts

### Using a preset

It's annoying having to write up all these settings for things as common as SCSS and JS files. The configuration required for JS files is especially annoying to put together.

As of version 2.0.0, a series of preset settings have been added to Gulp File Loader. Now all you need to do for a basic ES6 set up is this:

```js
// How to use a preset
.pipe(fileLoader({ preset: 'es6', dest: 'path/to/dest' }))
```

That preset will apply the following settings:

```js
var template = `
// This file is generated by gulp-file-loader.
// Do not edit this file.
// Do not save this file into source control.

$format[imports]

export default function(){
$format[functions]
}
`;

var default_settings = {
  format: {
    imports: 'import $name from "$path";',
    functions: '  $name();'
  },
  fileName: 'file-loader.js',
  template: template,
}
```

### Available presets

<dl>
  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/es6.js">es6</a></dt>
  <dd>JavaScript imports that use the modern <code>import thing from './file.js';</code> syntax.</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/es5.js">es5</a></dt>
  <dd>JavaScript imports that use the CommonJS <code>var thing = require('./file.js');</code> syntax.</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/pug.js">pug</a></dt>
  <dd>Intended for use with builds that use <a href="https://pugjs.org/api/getting-started.html">Pug</a> as the templating language <code>include ./file.pug</code>.</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/jade.js">jade</a></dt>
  <dd>For use on projects that haven't upgraded their old <a href="http://jade-lang.com/">Jade</a> powered projects to <a href="https://pugjs.org/api/getting-started.html">Pug</a> yet <code>include ./file.jade</code>.</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/scss.js">scss</a></dt>
  <dd>Sass import statements that use the <a href="https://sass-lang.com/guide">newer SCSS style syntax</a> <code>@import "./file.scss";</code>.</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/sass.js">sass</a></dt>
  <dd>Sass import statements that use the <a href="http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html">older indented style syntax</a> <code>@import ./file.sass</code>.</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/stylus.js">stylus</a></dt>
  <dd>Intended for use with the <a href="http://stylus-lang.com/">Stylus</a> CSS generation language <code>@import "./file.styl"</code>.</dd>
</dl>

You can browse the available presets and see what their settings look like in [the `presets` folder](https://github.com/Dan503/gulp-file-loader/tree/master/presets). The presets are named after the file names in that folder.

If you would like other presets to be added, you can [log an issue](https://github.com/Dan503/gulp-file-loader/issues/new) to request for a new preset to be added, or you can make a pull request to add one yourself.

### Overriding a preset

The preset setting just tells Gulp File Loader what to use as the default settings.

You can override any of the preset settings by providing your own alternative setting. For example, to change the output file name, you can do this:

```js
// Overriding the default preset setting for "fileName"
.pipe(fileLoader({ preset: 'es6', fileName: 'different-file-name.js', dest: 'path/to/dest' }))
```

## Other settings

- **fileName** = The file name for the output file. This setting includes the file extension.
- **dest** = Should be identical to the setting used in `gulp.dest`. It determines where the output file is sent after processing. The `gulp.dest` setting is unavailable at the time the plugin is called, thus the setting needs to be provided explicitly.
