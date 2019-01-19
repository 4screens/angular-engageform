const path = require('path')
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './bootstrap.ts',
  context: path.resolve(__dirname, 'src'),
  target: 'node',
  externals: [nodeExternals()],
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
