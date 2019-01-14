# Gulp File Loader

_Auto generate import-only files for any file type. SCSS, JS, Pug, whatever you want._

[![Supported Node version](https://img.shields.io/node/v/gulp-file-loader.svg?style=for-the-badge)](https://nodejs.org/en/)

Are you sick of having to manually manage files that are purely just a bunch of import statements?

Wouldn't it be awesome if Gulp could just look at your file system and manage this busy work for you?

That is where Gulp File Loader comes in. Gulp File Loader will automatically manage these import-only files for you giving you more time to worry about the important stuff.

Due to it's high level of customization, Gulp File Loader is able to generate any import file you can imagine. SCSS, JS, Pug, PHP, you name it, it can create an import file for it (assuming the language supports import functionality in some way).

Gulp File Loader also has the ability to remember the order that imports are declared in. If you have ever had any experience with glob-loading SCSS files, you will know the pain of trying to get `alpha.scss` to override styles in `beta.scss`. With Gulp File Loader, simply rearrange the import statements and you're done!

## Before and after Gulp File Loader <!-- omit in toc -->

### SCSS Before <!-- omit in toc -->

```scss
// main.scss (manually edited)

@import "../components/component-A/A.scss";
@import "../components/component-B/B.scss";
@import "../components/component-C/C.scss";
@import "../components/component-D/D.scss";
```

### SCSS After <!-- omit in toc -->
```scss
// main.scss (manually edited)

@import "./file-loader.scss";
```

```scss
// file-loader.scss (auto-generated)
// retains the order that imports are declared in if edited manually

@import "../components/component-A/A.scss";
@import "../components/component-B/B.scss";
@import "../components/component-C/C.scss";
@import "../components/component-D/D.scss";
```

### JS before <!-- omit in toc -->

```js
// main.js (manually edited)

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
// main.js (manually edited)

import $ from 'jquery';

import fileLoader from "./file-loader.js";

$(() => {
  fileLoader();
})
```

```js
// file-loader.js (auto-generated)

import A from "../components/component-A/A.js";
import B from "../components/component-B/B.js";
import C from "../components/component-C/C.js";
import D from "../components/component-D/D.js";

export default function() {
  A();
  B();
  C();
  D();
})
```

## Contents <!-- omit in toc -->

- [Install](#install)
- [Quick and easy preset settings](#quick-and-easy-preset-settings)
  - [Using a preset](#using-a-preset)
  - [Available presets](#available-presets)
  - [Overriding a preset](#overriding-a-preset)
- [Manual SCSS set up](#manual-scss-set-up)
  - [Gulp 4 SCSS set up](#gulp-4-scss-set-up)
  - [The `retainOrder` setting](#the-retainorder-setting)
- [Manual JS set up](#manual-js-set-up)
- [Understanding the `format` and `template` settings](#understanding-the-format-and-template-settings)
  - [The `$name` placeholder](#the-name-placeholder)
  - [The `$path` placeholder](#the-path-placeholder)
  - [Using indents](#using-indents)
- [Settings reference guide](#settings-reference-guide)
- [Change Log](#change-log)

## Install

Install Gulp File Loader using the following command:

```
npm install gulp-file-loader --save-dev
```

For my examples, I am assuming that the project folder structure looks like this:

```
[root]
|  source
|  |  components
|  |  |  [component-folders]
|  |  |  |  [component-name].js
|  |  |  |  [component-name].scss
|  |  js
|  |  |  file-loader.js
|  |  |  main.js
|  |  scss
|  |  |  config
|  |  |  |  [scss-config-files]
|  |  |  file-loader.scss
|  |  |  main.scss
|  build
|  |  assets
|  |  |  css
|  |  |  |  main.css
|  |  |  js
|  |  |  |  main.js
| gulpfile.js
```

## Quick and easy preset settings

### Using a preset

Writing out all of the required settings manually for this plugin can be a bit tiresome. As of version 2.0.0 I've included some common preset settings that you can use as defaults. All you need to do for a basic ES6 set up is this:

```js
// Preset ES6 JS gulp-file-loader task

var gulp = require('gulp');
var fileLoader = require('gulp-file-loader');

gulp.task('js:load', function(){

  // Always relative to gulpfile.js even if this code is inside a folder
  var dest = 'source/js';

  // Do not leave off the "return", it is vital!
  return gulp.src('./source/components/**/*.js')
    // Using the "es6" preset
    .pipe(fileLoader({ preset: 'es6', dest: dest }))
    .pipe(gulp.dest(dest))
})

gulp.task('js', ['js:load'], function(){
  // JS compile task goes here
})
```

That preset will apply the following default settings:

```js
var header = `
// This file is generated by gulp-file-loader.
// Do not edit this file.
// Do not save this file into source control.`;

var template = `
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
  header: header,
  template: template,
}
```

See the [Manual JS set up](#manual-js-set-up) section for more details on how to make use of the output file.

### Available presets

<dl>
  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/es6.js">es6</a></dt>
  <dd>JavaScript imports that use the modern import syntax (<code>import thing from './file.js';</code>).</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/es5.js">es5</a></dt>
  <dd>JavaScript imports that use the old CommonJS syntax (<code>var thing = require('./file.js');</code>).</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/pug.js">pug</a></dt>
  <dd>Intended for use with builds that use <a href="https://pugjs.org/api/getting-started.html">Pug</a> as the templating language (<code>include ./file.pug</code>).</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/jade.js">jade</a></dt>
  <dd>For use on projects that haven't upgraded their old <a href="http://jade-lang.com/">Jade</a> powered projects to <a href="https://pugjs.org/api/getting-started.html">Pug</a> yet (<code>include ./file.jade</code>).</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/scss.js">scss</a></dt>
  <dd>Sass import statements that use the <a href="https://sass-lang.com/guide">newer SCSS style syntax</a> (<code>@import "./file.scss";</code>).</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/sass.js">sass</a></dt>
  <dd>Sass import statements that use the <a href="http://sass-lang.com/documentation/file.INDENTED_SYNTAX.html">older indented style syntax</a> (<code>@import ./file.sass</code>).</dd>

  <dt><a href="https://github.com/Dan503/gulp-file-loader/blob/master/presets/stylus.js">stylus</a></dt>
  <dd>Intended for use with the <a href="http://stylus-lang.com/">Stylus</a> CSS generation language (<code>@import "./file.styl"</code>).</dd>
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

## Manual SCSS set up

Now that you know the quick and easy method, lets replicate one of these presets manually to show you how to use the plugin if the files you wish to load are not available as a preset.

I'll use SCSS as an example first because it is both simple and popular. You will need the Gulp Sass plugin for this to work
(`npm i gulp-sass -D`)

Create a gulp task that looks like this:

```js
// Typical SCSS gulp-file-loader task

var gulp = require('gulp');
var fileLoader = require('gulp-file-loader');

gulp.task('sass:load', function(){

  // Always relative to gulpfile.js even if this code is inside a folder
  var dest = 'source/scss';

  // Do not leave off the "return", it is vital!
  return gulp.src([
    // These paths are always relative to gulpfile.js
    './source/scss/config/**/*.scss', // These files will be loaded first
    './source/components/**/*.scss', // These files will be loaded second

    // Ignore files & folders that start with underscores
    '!./source/{**/\_*,**/\_*/**}',
  ])
    .pipe(fileLoader({
      // "$path" is replaced with a relative file path
      format: '@import "$path";',
      // destination folder (must match gulp.dest)
      dest: dest,
      // name of the output file
      fileName: 'file-loader.scss',
      // Don't change the order that imports are currently in
      retainOrder: true,
      // Add a message to the top of the file
      header: "// output from gulp-file-loader",
    }))
    .pipe(gulp.dest(dest))
})
```

The output of this Gulp task will look something like this:

```scss
// output from gulp-file-loader
@import "./config/A.scss";
@import "./config/B.scss";
@import "../components/one/one.scss";
@import "../components/two/two.scss";
```

Due to the `retainOrder: true` setting, you can rearrange the output. Gulp File Loader will preserve the order when it recompiles.

```scss
// Rearrange the output and Gulp File Loader will preserve it
// (Requires the `retainOrder` setting to be enabled)

@import "../components/one/one.scss";
@import "./config/A.scss";
@import "./config/B.scss";
@import "../components/two/two.scss";
```

If you add a new file to the system (eg. a `config/C.scss` file) gulp-file-loader will aim to group it with the other files found in the same folder.

```scss
// gulp-file-loader will aim to group new files with files found in the same folder

@import "../components/one/one.scss";
@import "./config/A.scss";
@import "./config/B.scss";
@import "./config/C.scss"; // new file added
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

Alternatively you can make `file-loader.scss` your main scss file and skip that last step altogether. This removes the need for a main.scss file.

```js
// Use file-loader.scss as the main scss file if you want

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', ['sass:load'], function(){
  return gulp.src('./source/scss/file-loader.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/assets/css'));
});
```

You can now auto-load all of you're component scss files while still retaining full control over CSS source order! 😃

### Gulp 4 SCSS set up

If you are using Gulp 4, the set-up will look more like this:

```js
// Gulp 4 set up

var gulp = require('gulp');
var sass = require('gulp-sass');
var fileLoader = require('gulp-file-loader');

// The "sass:load" task is identical to the Gulp 3 version
gulp.task('sass:load', function(){
  var dest = 'source/scss';
  return gulp.src([
    './source/scss/config/**/*.scss',
    './source/components/**/*.scss',
    '!./source/{**/\_*,**/\_*/**}',
  ])
    .pipe(fileLoader({
      format: '@import "$path";',
      dest: dest,
      fileName: 'file-loader.scss',
      retainOrder: true,
    }))
    .pipe(gulp.dest(dest))
})

// ['sass:load'] removed from Gulp 4 "sass:compile" task
gulp.task('sass:compile', function(){
  return gulp.src('./source/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/assets/css'));
});

// The main sass task uses gulp.series() to
// ensure that "sass:load" runs before "sass:compile"
gulp.task('sass', gulp.series('sass:load', 'sass:compile'))
```

### The `retainOrder` setting

I briefly touched on the `retainOrder` setting earlier, however there is a bit more to know about it.

In CSS, the order that styles are written in matters significantly. It is important that you are able to alter the order that files are loaded in if you wish to have full control over your CSS specificity.

Other globing methods (eg. `@import "../path/to/components/**/*.scss";`) do not give you the ability to alter the order that the files are loaded in. You are generally restricted to loading files in alphabetical order. Gulp File Loader gives you back the ability to control the order that your CSS loads in with it's `retainOrder` setting (introduced in v2.0.0).

By default `retainOrder` is set to `false`. When `retainOrder` is set to `true`, Gulp File Loader will not alter the order of the existing import paths if you manually edit them yourself. Make sure that if you enable the `retainOrder` setting you **save the output file into source control**. This will ensure that your co-workers don't end up with a CSS file that is in a different order to yours.

Gulp File Loader will still delete old files from the list that don't exist any more.

If it detects that a new file is added to the system, Gulp File Loader will aim to keep that new file grouped with other files found in the same folder. (Prior to v2.1.0 it just dumped it at the bottom of the file). This means that new scss config file imports will be placed at the top of the file-loader file with the other config files. This gives all your component files access to the new config settings without you having to make any alterations to the imports file.

It will not retain any comments or other alterations to the file. It will only retain the order that the imports were announced in.

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

  var dest = 'source/js';

  return gulp.src([
    './source/components/**/*.js',
    // Ignore files & folders that start with underscores
    '!./source/{**/\_*,**/\_*/**}'
  ])
    .pipe(fileLoader({
      // Format is now split into an object holding named format strings
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
// component js file example

export default function on_page_load() {
  // Place code here that you wish to run
  // when the `fileLoader()` function is called
}
```

## Understanding the `format` and `template` settings

It is recommended that you use an ES6 Template Literal (the back tick style strings) for creating the template rather than regular strings. Template Literals will allow you to define the markup found inside the output file exactly as written in a single string. Regular strings don't accept new lines so it makes writing the template much more difficult.

Remember that Template Literal's count all white space literally, so any white space you add to the template will appear in the final output. To avoid an odd looking output file, save the template to a `template` variable outside of the gulp task so that there is no indentation to the side of it.

The template works by replacing each `$format[formatName]` statement with a full list of imports formated in the specified way provided in the `format` object.

If the `format` setting is provided as a string, the `template` setting is ignored. If `format` is provided as an object, the `template` setting is required.

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

// ... other Gulp code ...

.pipe(fileLoader({
  format: {
    imports: 'import $name from "$path";',
    // The indent is added here, not in the template
    functions: '    $name();'
  },
  dest: dest,
  fileName: 'file-loader.js',
  template: template
}))
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

## Settings reference guide

<dl>
  <dt>header</dt>
  <dd>A string of text that is added to the <strong>top</strong> of the output file when it is generated. This is good for leaving comments like "<code style="white-space: nowrap;">// Do not edit this file</code>".</dd>

  <dt>footer</dt>
  <dd>A string of text that is added to the <strong>bottom</strong> of the output file when it is generated. This might be useful for calling a custom function at the bottom of the file after all the imports have been loaded.</dd>

  <dt>format</dt>
  <dd>The format setting dictates the format of each import line in the generated file. It can either be a string or an object holding multiple named strings. If you provide an object to this setting, the <code>template</code> setting is also required. Use the <code>$path</code> and <code>$name</code> placeholders inside the string to determine where the file path and name should go.</dd>

  <dt>template</dt>
  <dd>The template setting holds a string that dictates the overall structure of the generated file. Use <code>$format[formatName]</code> placeholders in the template string to dictate where each format should be used in the output file. If the <code>format</code> setting is provided as a string, the <code>template</code> setting is ignored.</dd>

  <dt>fileName</dt>
  <dd>A string holding the file name for the output file. The file extension must be included.</dd>

  <dt>dest</dt>
  <dd>Should be identical to the setting used in <code>gulp.dest</code>. It determines where the output file is sent after processing. It is <strong>always</strong> a relative path from <code>gulpfile.js</code>,  <strong>not a relative path from the current file</strong>. Example: <code>"path/to/destination"</code>. The <code>gulp.dest</code> setting is unavailable at the time the plugin is called, thus the setting needs to be provided explicitly.</dd>

  <dt>retainOrder</dt>
  <dd>This is set to <code>false</code> by default. When set to <code>true</code>, it will never alter the order that imports are loaded in. This gives you the ability to manually edit the output file to achieve the desired import order. Make sure to <strong>save the output file into source control</strong> so that your team mates end up with a file that is in the same order as yours.</dd>

  <dt>preset</dt>
  <dd>Use a set of predefined default settings rather than configuring all of the settings yourself. You can view the available presets and the settings that they provide in <a href="https://github.com/Dan503/gulp-file-loader/tree/master/presets">the <code>presets</code> folder</a>.</dd>
</dl>

## Change Log

The Change log can be viewed on the [Gulp File Loader GitHub releases](https://github.com/Dan503/gulp-file-loader/releases) page.
