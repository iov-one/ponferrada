module.exports = {
  //https://codequs.com/p/rk7e07UBV/using-eslint-and-prettier-in-a-typescript-project
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": [ "error", {
      allowExpressions: true,
    }]
  },
  plugins: ['@typescript-eslint', 'react'],
};
