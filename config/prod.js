// config/prod.js
const baseConfig = require('./base');

module.exports = {
  ...baseConfig,
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // ...
  },
  // Any other production-specific overrides
};
