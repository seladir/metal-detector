module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: 'airbnb-base',
  plugins: ['prettier'],
  rules: {
    indent: [2, 2, { SwitchCase: 1 }],
    'linebreak-style': [2, 'unix'],
    quotes: [2, 'single'],
    semi: [2, 'never'],
    'object-curly-newline': [2, { consistent: true }],
    'function-paren-newline': [0],
    'max-len': [2, 120],
    'no-mixed-operators': ['error', {
      allowSamePrecedence: true,
    }],
    'no-restricted-syntax': [0],
    'no-await-in-loop': [0],
    'no-underscore-dangle': [0],
  },
}
