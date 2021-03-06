/* jshint esversion: 6 */

const gulp = require('gulp');
const sourcemap = require('gulp-sourcemaps');
const compiler = require('google-closure-compiler-js').gulp();
const prettify = require('gulp-js-prettify')
const util = require('gulp-util')
// const frontMatter = require('gulp-front-matter');
// const swig = require('gulp-swig');

const debug = false;
const dense = !debug; // Should the code be compiled?
const pretty = debug; // Should the code be reformatted with sensible whitespace?

// Expose the original source to the browser.
// In theory this would make it easier to debug, but somehow Chrome is failing
// to set breakpoints in the mapped source, and things get wonky in the ES5
// runtime.
const do_sourcemap = false;


const gulp_frontmatter_options = {
  remove: true,
  property: 'data.page' // for compliance with Jekyll
};

const gulp_options = {
  base: './src/'
};

// const consume_files = [
//   './src/module/logger.js', // Provide logger first (core dependency)
//   './src/module/*.js',      // All modules and internal dependencies
//   './src/*.js'              // The main {pirate.js}
// ];

// console.log('Path: ' + process.cwd())

gulp.task('pirate.min.js', function() {
  var noop = util.noop();
  return gulp.src(['./_includes/pirate.js'], gulp_options)
      // .pipe(frontMatter(gulp_frontmatter_options))
      // .pipe(swig())
      .pipe(sourcemap.init())
      .pipe(compiler({
          compilationLevel: (dense ? 'ADVANCED' : 'SIMPLE'),
          warningLevel: 'VERBOSE',
          languageIn: 'ECMASCRIPT6',
          languageOut: 'ECMASCRIPT5',
          defines: {
            // ENABLE_LOGGING: (!dense)
          },
          processCommonJsModules: true,
          outputWrapper: '(function(){\n%output%\n}).call(this)',
          jsOutputFile: './dist/pirate.min.js',  // outputs single file
          createSourceMap: (do_sourcemap ? './dist/pirate.min.js.map' : null)
        }))
      .pipe((dense && !pretty) ? noop : prettify({ collapseWhitespace: true }))
      .pipe(do_sourcemap ? sourcemap.write('./') : noop)
      .pipe(gulp.dest('./_includes/'));
});

gulp.task('testkit.min.js', function(){
  return gulp.src(['./js/test/testkit.js'], {base: './js/'})
    .pipe(compiler({
      compilationLevel: 'SIMPLE',
      warningLevel: 'VERBOSE',
      languageIn: 'ECMASCRIPT5',
      languageOut: 'ECMASCRIPT5',
      outputWrapper: "%output%",
      jsOutputFile: "./dist/testkit.min.js"
    }))
    .pipe(gulp.dest('./js/test/'));
});


gulp.task('default', ['pirate.min.js']);
