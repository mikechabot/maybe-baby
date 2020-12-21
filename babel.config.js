module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/env',
      {
        targets: '> 0.25%, not dead',
        useBuiltIns: 'entry',
        corejs: '3',
      },
    ],
  ],
  plugins: ["@babel/plugin-proposal-class-properties"]
};
