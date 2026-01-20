import gts from 'gts';

export default [
  ...gts.configs.recommended,
  {
    ignores: ['build/**', 'node_modules/**']
  }
];
