module.exports = {
  //https://codequs.com/p/rk7e07UBV/using-eslint-and-prettier-in-a-typescript-project
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    "no-empty": "off",
    "no-console": ["warn", {
      allow: ["error", "info", "warn"]
    }],
    "no-param-reassign": "warn",
    "sort-imports": "off", // we use the simple-import-sort plugin instead
    "simple-import-sort/sort": "warn",
    "@typescript-eslint/explicit-function-return-type": [ "error", {
      allowExpressions: true,
    }],
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  plugins: ["@typescript-eslint", "react", "simple-import-sort"],
};
