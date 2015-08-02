var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var pkg = require('./package.json');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var sh = require('shelljs');

var PATH = {
  bower_components: 'bower_components',
  source: 'src',
  test: 'test',
  define: 'typings'
};
var FILES = [
  path.join('.', PATH.source, 'header.ts'),
  path.join('.', PATH.source, 'engageform', 'enum.ts'),
  path.join('.', PATH.source, 'page', 'enum.ts'),

  path.join('.', PATH.source, 'events', 'events.ts'),

  path.join('.', PATH.source, 'app.ts'),
  path.join('.', PATH.source, 'bootstrap.ts'),

  path.join('.', PATH.source, 'branding', 'ibranding.ts'),
  path.join('.', PATH.source, 'branding', 'branding.ts'),

  path.join('.', PATH.source, 'engageform', 'engageform.ts'),
  path.join('.', PATH.source, 'engageform', 'settings.ts'),
  path.join('.', PATH.source, 'engageform', 'theme.ts'),

  path.join('.', PATH.source, 'engageform', 'type', 'outcome.ts'),
  path.join('.', PATH.source, 'engageform', 'type', 'poll.ts'),
  path.join('.', PATH.source, 'engageform', 'type', 'score.ts'),
  path.join('.', PATH.source, 'engageform', 'type', 'survey.ts'),
  path.join('.', PATH.source, 'engageform', 'type', 'live.ts'),

  path.join('.', PATH.source, 'navigation', 'navigation.ts'),

  path.join('.', PATH.source, 'page', 'page.ts'),
  path.join('.', PATH.source, 'page', 'case.ts'),
  path.join('.', PATH.source, 'page', 'settings.ts'),

  path.join('.', PATH.source, 'page', 'case', 'image.ts'),
  path.join('.', PATH.source, 'page', 'case', 'input.ts'),
  path.join('.', PATH.source, 'page', 'case', 'iteration.ts'),
  path.join('.', PATH.source, 'page', 'case', 'text.ts'),

  path.join('.', PATH.source, 'page', 'type', 'endpage.ts'),
  path.join('.', PATH.source, 'page', 'type', 'form.ts'),
  path.join('.', PATH.source, 'page', 'type', 'multichoice.ts'),
  path.join('.', PATH.source, 'page', 'type', 'picturechoice.ts'),
  path.join('.', PATH.source, 'page', 'type', 'rateit.ts'),
  path.join('.', PATH.source, 'page', 'type', 'startpage.ts'),
  path.join('.', PATH.source, 'page', 'type', 'buzzer.ts'),
  path.join('.', PATH.source, 'page', 'type', 'poster.ts'),

  path.join('.', PATH.source, 'user', 'user.ts')
];
var BANNER = path.join('.', PATH.source, 'header.txt');
var MAIN = path.join('.', 'engageform.js');
var TESTS = [
  path.join('.', PATH.bower_components, 'angular', 'angular.js'),
  path.join('.', PATH.bower_components, 'angular-local-storage', 'dist', 'angular-local-storage.js'),
  path.join('.', PATH.bower_components, 'angular-mocks', 'angular-mocks.js'),
  path.join('.', PATH.bower_components, 'angular-sanitize', 'angular-sanitize.js'),
  MAIN,
  path.join('.', PATH.test, '**', '*.spec.ts')
];


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

gulp.task('header', ['bump'], function() {
  return gulp.src(BANNER)
    .pipe(plugins.rename({extname: '.ts'}))
    .pipe(plugins.replace(/<%= pkg\.(\w+)\.?(\w+)? %>/g, function(chars, major, minor) {
      return minor?pkg[major][minor]:pkg[major];
    }))
    .pipe(gulp.dest(PATH.source));
});

gulp.task('build', ['header'], function() {
  var ts = gulp.src(FILES)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.typescript({
      target: 'ES5',
      declarationFiles: false
    }));

  return ts.js
    .pipe(plugins.concat(MAIN))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
});

gulp.task('minify', ['build'], function() {
  return gulp.src(MAIN)
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.uglify({
      preserveComments: 'some'
    }))
    .pipe(plugins.rename({extname: '.min.js'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
});

gulp.task('develop', ['minify'], function() {
  gulp.watch(FILES, ['minify']);
});

gulp.task('tslint', ['minify'], function () {
  return gulp.src(FILES)
    .pipe(plugins.tslint())
    .pipe(plugins.tslint.report('verbose'));
});

// TODO: gulp-karma does not include fixtures...
gulp.task('test', ['tslint'], function() {
  return gulp.src(TESTS)
    .pipe(plugins.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('release::bump', ['tslint'], function(done) {
  if (plugins.util.env.bump) {
    sh.exec('git add .');
    sh.exec('git commit -m "chore(release): Bump version." --quiet');
    sh.exec('git push');
  }

  done();
});

gulp.task('release', ['release::bump'], function() {
  sh.exec('mkdir release');
  sh.exec('mv -f engageform.* release/');

  plugins.git.checkout('release', {quiet: true}, function (err) {
    if (err) throw err;

    sh.exec('mv release/* ./');
    sh.exec('rm -r release');
    sh.exec('git add engageform.js engageform.js.map engageform.min.js engageform.min.js.map');
    sh.exec('git commit -m "feat(release): New build files." --quiet');
    sh.exec('git push');
    sh.exec('git tag v' + pkg.version);
    sh.exec('git push -v origin refs/tags/v' + pkg.version);
    sh.exec('git reset -q --hard HEAD');
    sh.exec('git checkout v0.2.x --quiet');
  });
});
