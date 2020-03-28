const window = global.window || {};
// Hack while material-ui Box fixes its internal problem
// https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Box/Box.js#L31
// https://github.com/mui-org/material-ui/blob/next/packages/material-ui-styles/src/withStyles/withStyles.js#L75
// Another fix could be in withStyles.js use:
// defaultTheme = defaultTheme === undefined ? {} : defaultTheme
window.disableShallowSupport = true;

global.window = window;
global.developmentConfig = require("./config/test.json");
