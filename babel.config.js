const presets = [
  '@babel/preset-typescript',
  [
    '@babel/env',
    {
      targets: {
        edge: '17',
        firefox: '60',
        chrome: '67',
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
