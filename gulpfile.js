const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')( require('sass') );

function buildStyles() {
   return src(['src/styles/**/*.scss'])
      .pipe( sass() )
      .pipe( dest('dist/styles') )
   ;
}

function watchStyles() {
   watch( ['src/styles/**/*.scss', 'src/*.html', 'public/*.html'], buildStyles);
}

exports.default = series( buildStyles, watchStyles );