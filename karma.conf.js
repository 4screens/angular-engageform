/**
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE' or 'LICENSE.txt', which is part of this source code package.
 */

module.exports = function(config) {
  config.set({
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'engageform.js',
      'test/**/*.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS', 'Chrome'],

    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-coverage'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'engageform.js': ['coverage']
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: '.'
    }
  });
};
