/**
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE' or 'LICENSE.txt', which is part of this source code package.
 */
var gulp = require('gulp')
, plugins = require('gulp-load-plugins')()
, pkg = require('./package.json')
, fs = require('fs')

, VIEWS = [
    './src/views/main.html',
    './src/views/question-forms.html',
    './src/views/question-infoPage.html',
    './src/views/question-multiChoice.html',
    './src/views/question-pictureChoice.html',
    './src/views/question-rateIt.html',
    './src/views/question-startPage.html',
    './src/views/question-endPage.html'
  ]
, FILES = [
    './src/app.js',
    './src/views.js',
    './src/controllers/default.js',
    './src/directives/swiper.js',
    './src/filters/nl2br.js',
    './src/filters/questions-order.js',
    './src/services/backend.js',
    './src/services/cloudinary.js'
  ]
, BANNER = './src/header.txt'
, MAIN = 'engageform.js';

gulp.task( 'jscodesnifer', function() {
  return gulp.src( FILES )
    .pipe( plugins.jscodesniffer(
      { standard: 'Idiomatic', reporters: [ 'default', 'failer' ] }
    ) );
});

gulp.task( 'lint', ['jscodesnifer'], function() {
  return gulp.src( FILES )
    .pipe( plugins.jshint() )
    .pipe( plugins.jshint.reporter('jshint-stylish') );
} );

gulp.task( 'clean:tmp', function() {
  return gulp.src( '.tmp', { read: false } )
    .pipe( plugins.clean() );
} );

gulp.task( 'clean:views', ['copy'], function() {
  return gulp.src( './src/views.js', { read: false } )
    .pipe( plugins.clean() );
} );

gulp.task( 'minify:html', [ 'clean:tmp', 'lint' ], function() {
  return gulp.src( VIEWS )
    .pipe( plugins.minifyHtml({
      empty: true,
      quotes: true
    }) )
    .pipe( gulp.dest('.tmp/views') );
} );

gulp.task( 'html2js', ['minify:html'], function() {
  return gulp.src( '.tmp/views/*.html' )
    .pipe( plugins.ngHtml2js({
        moduleName: pkg.name.replace( '-', '.' ),
        declareModule: false,
        prefix: 'views/%s/'.replace( '%s', pkg.name.split('-')[1] )
    }) )
    .pipe( gulp.dest('.tmp/views') );
} );

gulp.task( 'build:html', ['html2js'], function() {
  return gulp.src('.tmp/views/*.js')
    .pipe( plugins.concat( 'views.js' ) )
    .pipe( gulp.dest('src') );
} );

gulp.task( 'build', ['build:html'], function() {
  return gulp.src( FILES )
    .pipe( plugins.concat( MAIN ) )
    .pipe( plugins.ngAnnotate() )
    .pipe( plugins.header( fs.readFileSync( BANNER, 'utf8' ), { pkg : pkg } ) )
    .pipe( gulp.dest('.') );
} );

gulp.task( 'minify', ['build'], function() {
  return gulp.src( MAIN )
    .pipe( plugins.plumber() )
    .pipe( plugins.uglify() )
    .pipe( plugins.rename({ extname: '.min.js' }) )
    .pipe( plugins.header( fs.readFileSync( BANNER, 'utf8' ), { pkg : pkg } ) )
    .pipe( gulp.dest('.') );
} );

gulp.task( 'copy', [ 'minify' ], function() {
  return gulp.src([ MAIN, MAIN.replace('.js', '.min.js') ])
    .pipe( gulp.dest('examples/client/vendor') );
} );

gulp.task( 'complexity', function() {
  return gulp.src( MAIN )
    .pipe( plugins.complexity() );
} );

gulp.task( 'watch', function() {
  gulp.watch( FILES, [ 'complexity', 'clean:views' ] );
} );

gulp.task( 'default', ['clean:views'] );
