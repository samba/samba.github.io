/* jshint esversion: 6 */

const gulp = require('gulp');
const compiler = require('google-closure-compiler-js').gulp();
// const frontMatter = require('gulp-front-matter');
// const swig = require('gulp-swig');


const gulp_frontmatter_options = {
  remove: true,
  property: 'data.page' // for compliance with Jekyll
};

const gulp_options = {
  base: './src/'
};

const consume_files = [
  './src/module/*.js',    // All modules and internal dependencies
  './src/*.js'            // The main {pirate.js}
];

console.log('Path: ' + process.cwd())

gulp.task('pirate.min.js', function() {
  return gulp.src(consume_files, gulp_options)
      // .pipe(frontMatter(gulp_frontmatter_options))
      // .pipe(swig())
      .pipe(compiler({
          compilationLevel: 'ADVANCED',
          warningLevel: 'VERBOSE',
          languageIn: 'ECMASCRIPT6',
          languageOut: 'ECMASCRIPT5',
          // defines: {},
          processCommonJsModules: true,
          outputWrapper: '(function(){\n%output%\n}).call(this)',
          jsOutputFile: './dist/pirate.min.js',  // outputs single file
          createSourceMap: true
        }))
      .pipe(gulp.dest('./_includes/'));
});


gulp.task('default', ['pirate.min.js']);
