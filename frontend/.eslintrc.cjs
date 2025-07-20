module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    // Fast-refresh rules added manually
  ],
  env: {
    browser: true,
    es2020: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'react-refresh/only-export-components': 'warn'
  }
};
