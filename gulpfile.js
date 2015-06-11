var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var pkg = require('./package.json');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var sh = require('shelljs');

var PATH = {
  source: 'src',
  define: 'typings'
};
var FILES = [
  path.join('.', PATH.define, 'tsd.d.ts'),
  path.join('.', PATH.source, 'app.ts')
];
var BANNER = path.join('.', PATH.source, 'header.txt');
var MAIN = path.join('.', 'engageform.js');

gulp.task('bump', function() {
  var bump = plugins.util.env.bump || false;

  if (bump) {
    pkg.version = semver.inc(pkg.version, 'patch');
  }

  return gulp.src(['./bower.json', './package.json'])
    .pipe(plugins.if(bump, plugins.bump({
      version: pkg.version
    })))
    .pipe(gulp.dest('.'));
});

gulp.task('compile', ['bump'], function() {
  var ts = gulp.src(FILES)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.typescript({
      target: 'ES5',
      declarationFiles: false
    }));

  return ts.js
    .pipe(plugins.concat(MAIN))
    .pipe(plugins.header(fs.readFileSync(BANNER, 'utf8'), {pkg : pkg}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
});

gulp.task('build', ['compile'], function() {
  return gulp.src(MAIN)
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({extname: '.min.js'}))
    .pipe(plugins.header(fs.readFileSync(BANNER, 'utf8'), {pkg : pkg}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
});

gulp.task('develop', ['build'], function() {
  gulp.watch(FILES, ['build']);
});

gulp.task('release::bump', ['build'], function(done) {
  if (plugins.util.env.bump) {
    sh.exec('git add .');
    sh.exec('git commit -m "chore(release): Bump version." --quiet');
    sh.exec('git push');
  }

  done();
});

gulp.task('release', ['release::bump'], function() {
  plugins.git.checkout('release', {quiet: true}, function (err) {
    if (err) throw err;

    sh.exec('git add engageform.js engageform.js.map engageform.min.js engageform.min.js.map');
    sh.exec('git commit -m "feat(release): New build files." --quiet');
    sh.exec('git push');
    sh.exec('git tag v' + pkg.version);
    sh.exec('git push -v origin refs/tags/v' + pkg.version);
    sh.exec('git checkout v0.2.x --quiet');
  });
});
