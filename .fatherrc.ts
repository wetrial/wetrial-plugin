export default [
  {
    cjs: 'babel',
  },
  {
    entry: 'ui/index.tsx',
    typescriptOpts: {
      check: false,
    },
    umd: {
      name: 'wetrial-ui-plugin',
      minFile: false,
    },
  },
];
