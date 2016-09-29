const gulp = require('gulp');
const compiler = require('google-closure-compiler-js').gulp();
const frontMatter = require('gulp-front-matter');
const swig = require('gulp-swig');


const gulp_options = {
  remove: true,
  property: 'data.page' // for compliance with Jekyll
};

gulp.task('script', function() {
  return gulp.src('./js/pirate.js', {base: './'})
      .pipe(frontMatter(gulp_options))
      .pipe(swig())
      .pipe(compiler({
          compilationLevel: 'ADVANCED',
          warningLevel: 'VERBOSE',
          outputWrapper: '(function(){\n%output%\n}).call(this)',
          jsOutputFile: './dist/pirate.min.js',  // outputs single file
          createSourceMap: true,
        }))
      .pipe(gulp.dest('./js'));
});


gulp.task('default', ['script']);
