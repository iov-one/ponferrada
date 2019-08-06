export const window = global.window || {};

global.window = window;
global.developmentConfig = require("./config/development.json");
