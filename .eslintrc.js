module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { 'ignoreRestSiblings': true, 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_'  }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'never'],
    'object-curly-spacing': 'off',
    'max-len': ['warn', { 'code': 120 }],
    '@typescript-eslint/object-curly-spacing': ['error', 'always']
  }
}
