// config/dev.js
const baseConfig = require('./base');

module.exports = {
  ...baseConfig,
  database: {
    host: 'localhost',
    user: 'devuser',
    password: 'devpassword',
    // ...
  },
  // Any other dev-specific overrides
};
