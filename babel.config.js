const presets = [
  '@babel/preset-typescript',
  [
    '@babel/env',
    {
      // Use old browsers to force es2015. Uglify in the main app fails otherwise. 🤦‍♂️
      targets: {
        ie: '8',
        edge: '17',
        firefox: '60',
        chrome: '30',
        safari: '11.1',
      },
      useBuiltIns: false, // FIXME: the build throws errors when `usage` is set.
    },
  ],
]

const plugins = [
  "@babel/proposal-class-properties",
  "@babel/proposal-object-rest-spread"
]

module.exports = {presets, plugins}
