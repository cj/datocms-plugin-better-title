module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
  },

  global: {
    DatoCmsPlugin: true,
  },

  extends: [
    'airbnb-base',
  ],

  parserOptions: {
    parser: 'babel-eslint',
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    semi: ['error', 'never'],

    'comma-dangle': [2, 'always-multiline'],

    'no-return-assign': ['error', 'except-parens'],
  },
}
