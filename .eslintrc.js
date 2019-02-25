module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
      'plugin:@typescript-eslint/recommended',
      'react-app',
      'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2]
  },
};
