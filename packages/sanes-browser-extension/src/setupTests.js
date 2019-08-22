export const window = global.window || {};
// Hack while material-ui Box fixes its internal problem
// https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Box/Box.js#L31
// https://github.com/mui-org/material-ui/blob/next/packages/material-ui-styles/src/withStyles/withStyles.js#L75
// Another fix could be in withStyles.js use:
// defaultTheme = defaultTheme === undefined ? {} : defaultTheme
window.disableShallowSupport = true;

global.window = window;
global.config = require('../public/assets/config/conf.json');

class LocalStorageMock {
  store: Record<string, any>; // eslint-disable-line

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

global.document.createRange = () => ({
  setEnd: () => {},
  setStart: () => {},
  commonAncestorContainer: {
    nodeName: 'body',
    ownerDocument: document,
  },
});
