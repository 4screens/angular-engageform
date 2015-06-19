module.exports = function(config) {
  config.set({

    browsers: [
      'Chrome',
      'PhantomJS'
    ],

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'engageform.js',
      'test/*.spec.js'
    ],

    frameworks: [
      'chai',
      'mocha'
    ],

    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher'
    ],

    preprocessors: {
      'engageform.js': ['coverage'],
      'test/**/*.ts': ['typescript']
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
        target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
        module: 'amd', // (optional) Specify module code generation: 'commonjs' or 'amd'
        noImplicitAny: true, // (optional) Warn on expressions and declarations with an implied 'any' type.
        noResolve: true, // (optional) Skip resolution and preprocessing.
        removeComments: true // (optional) Do not emit comments to output.
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
