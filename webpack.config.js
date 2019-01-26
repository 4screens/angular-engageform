const path = require('path')

module.exports = {
  entry: './bootstrap.ts',
  context: path.resolve(__dirname, 'src'),
  target: 'web',
  externals: {
    angular: 'angular',
    lodash: '_'
  },
  mode: 'production',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
}
