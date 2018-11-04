module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
    es6: true,
  },

  globals: {
    Dato: true,
    DatoCmsPlugin: true,
  },

  extends: [
    'airbnb-base',
  ],

  parser: "babel-eslint",

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    semi: ['error', 'never'],

    'comma-dangle': [2, 'always-multiline'],

    'no-return-assign': ['error', 'except-parens'],

    'no-underscore-dangle': [2, { 'allowAfterThis': true }],
  },
}
