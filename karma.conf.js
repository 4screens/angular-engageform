module.exports = function(config) {
  config.set({
    browsers: [
      'Chrome',
      'Firefox',
      'PhantomJS'
    ],

    files: [
      './node_modules/angular/angular.js',
      './node_modules/4screens-util/util.js',
      './node_modules/angular-local-storage/dist/angular-local-storage.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './node_modules/angular-sanitize/angular-sanitize.js',
      './node_modules/lodash/lodash.min.js',
      './engageform.js',
      './test/**/*.spec.ts',

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
