module.exports = function(config) {
  config.set({
    browsers: [
      'Chrome',
      'Firefox',
      'PhantomJS'
    ],

    files: [
      './bower_components/angular/angular.js',
      './bower_components/4screens-util/util.js',
      './bower_components/angular-local-storage/dist/angular-local-storage.js',
      './bower_components/angular-mocks/angular-mocks.js',
      './bower_components/angular-sanitize/angular-sanitize.js',
      './bower_components/lodash/lodash.min.js',
      './engageform.js',
      // FIXME: What are those tests testing, anyway?
      //'./test/**/*.spec.ts',

      // fixtures
      {
        pattern: 'test/mock/**/*.json',
        watched: true,
        served: true,
        included: false
      }
    ],

    frameworks: ['jasmine-jquery', 'jasmine'],

    plugins: [
      'karma-jasmine',
      'karma-jasmine-jquery',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-typescript-preprocessor'
    ],

    preprocessors: {
      'engageform.js': ['coverage'],
      '**/*.spec.ts': ['typescript']
    },

    reporters: [
      'progress', 'coverage'
    ],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: '.'
    },

    typescriptPreprocessor: {
      // options passed to the typescript compiler
      options: {
        sourceMap: false, // (optional) Generates corresponding .map file.
        target: 'es5'     // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
      },
      // extra typing definitions to pass to the compiler (globs allowed)
      typings: [
        'typings/tsd.d.ts'
      ],
      // transforming the filenames
      transformPath: function(path) {
        return path.replace(/\.ts$/, '.js');
      }
    }
  });
};
