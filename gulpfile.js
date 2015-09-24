'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var pkg = require('./package.json');
var path = require('path');
var semver = require('semver');
var sh = require('shelljs');
var KarmaServer = require('karma').server;

plugins.minimist = require('minimist')(process.argv.slice(2));

var PATH = {
  bower_components: 'bower_components',
  build: '.',
  define: 'typings',
  dist: 'release',
  source: 'src',
  test: 'test'
};
var FILES = [
  path.join('.', PATH.source, 'header.ts'),
  path.join('.', PATH.source, 'engageform', 'enum.ts'),
  path.join('.', PATH.source, 'page', 'enum.ts'),

  path.join('.', PATH.source, 'app.ts'),
  path.join('.', PATH.source, 'bootstrap.ts'),

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

  path.join('.', PATH.source, 'meta', 'meta.ts'),

  path.join('.', PATH.source, 'page', 'page.ts'),
  path.join('.', PATH.source, 'page', 'case.ts'),
  path.join('.', PATH.source, 'page', 'settings.ts'),

  path.join('.', PATH.source, 'page', 'case', 'image.ts'),
  path.join('.', PATH.source, 'page', 'case', 'input.ts'),
  path.join('.', PATH.source, 'page', 'case', 'iteration.ts'),
  path.join('.', PATH.source, 'page', 'case', 'text.ts'),
  path.join('.', PATH.source, 'page', 'case', 'buzz.ts'),

  path.join('.', PATH.source, 'page', 'type', 'endpage.ts'),
  path.join('.', PATH.source, 'page', 'type', 'form.ts'),
  path.join('.', PATH.source, 'page', 'type', 'multichoice.ts'),
  path.join('.', PATH.source, 'page', 'type', 'picturechoice.ts'),
  path.join('.', PATH.source, 'page', 'type', 'rateit.ts'),
  path.join('.', PATH.source, 'page', 'type', 'startpage.ts'),
  path.join('.', PATH.source, 'page', 'type', 'buzzer.ts'),
  path.join('.', PATH.source, 'page', 'type', 'poster.ts'),

  path.join('.', PATH.source, 'user', 'user.ts'),

  path.join('.', PATH.source, 'util', 'event.ts')
];
var BANNER = path.join('.', PATH.source, 'header.txt');
var MAIN = 'engageform.js';
var TESTS = [
  path.join('.', PATH.bower_components, 'angular', 'angular.js'),
  path.join('.', PATH.bower_components, 'angular-local-storage', 'dist', 'angular-local-storage.js'),
  path.join('.', PATH.bower_components, 'angular-mocks', 'angular-mocks.js'),
  path.join('.', PATH.bower_components, 'angular-sanitize', 'angular-sanitize.js'),
  path.join('.', PATH.build, MAIN),
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
    .pipe(plugins.wrapper({
      header: '(function(angular) {\n',
      footer: '})(angular);'
    }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(PATH.build));
});

gulp.task('minify', ['build'], function() {
  return gulp.src(path.join('.', PATH.build, MAIN))
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.uglify({
      preserveComments: 'some'
    }))
    .pipe(plugins.rename({extname: '.min.js'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(PATH.build));
});

gulp.task('publish', ['minify'], function() {
  gulp.watch(FILES, ['publish::copy']);
});

gulp.task('publish::copy', ['tslint'], function() {
  return gulp.src(MAIN)
    .pipe(gulp.dest(plugins.minimist.path || '../4screens-suros/app/bower_components/4screens-engageform2/'));
});

gulp.task('develop', ['minify'], function() {
  gulp.watch(FILES, ['tslint']);
});

gulp.task('tslint', ['minify'], function () {
  return gulp.src(FILES)
    .pipe(plugins.tslint())
    .pipe(plugins.tslint.report('verbose'));
});

gulp.task('test', ['tslint'], function(done) {
   KarmaServer.start({
     configFile: __dirname + '/karma.conf.js',
     singleRun: true
   }, function(error) {
     if (error) {
       plugins.git.checkout('*.json', {args: '--'}, function(err) {
         if (err) throw err;
         done();
       });
     } else {
       done();
     }
   });
});

gulp.task('release::bump::commit', ['test'], function() {
  if (plugins.util.env.bump) {
    return gulp.src(['./bower.json', './package.json'])
      .pipe(plugins.git.add())
      .pipe(plugins.git.commit('chore(release): Bump version.'));
  }
});

gulp.task('release::bump::push', ['release::bump::commit'], function(done) {
  if (plugins.util.env.bump) {
    return plugins.git.push('origin', 'v0.2.x', done);
  }
});

gulp.task('release::dist::cleanup', function() {
  sh.rm('-rf', path.join('.', PATH.dist));
});

gulp.task('release::dist::clone', ['release::dist::cleanup'], function(done) {
  return plugins.git.clone(pkg.repository.url, {args: PATH.dist}, function () {
    plugins.git.checkout('release', {cwd: PATH.dist}, done);
  });
});

gulp.task('release::dist::commit', ['release::dist::clone', 'test'], function() {
  var diff = MAIN.split('.')[0] + '*';
  sh.cp('-rf', diff, path.join('.', PATH.dist));

  return gulp.src(path.join('.', PATH.dist, diff))
    .pipe(plugins.git.add({cwd: PATH.dist}))
    .pipe(plugins.git.commit('feat(release): New build files.', {cwd: PATH.dist}));
});

gulp.task('release::dist::push', ['release::dist::commit'], function(done) {
  return plugins.git.push('origin', 'release', {cwd: PATH.dist}, done);
});

gulp.task('release::dist::tag', ['release::dist::push'], function(done) {
  return plugins.git.tag('v' + pkg.version, 'v' + pkg.version, {cwd: PATH.dist}, function(err) {
    if (err) {
      throw err;
    }

    plugins.git.push('origin', 'refs/tags/v' + pkg.version, {cwd: PATH.dist}, done);
  });
});

gulp.task('release', ['release::bump::push', 'release::dist::tag']);
