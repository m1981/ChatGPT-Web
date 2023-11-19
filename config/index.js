// config/index.js

// How to acces config in the app code
// const config = require('./config');
// console.log(config.appName); // 'MyApp' from the base config
// console.log(config.database.host); // environment-specific from dev/prod/ci


const devConfig = require('./dev');
const prodConfig = require('./prod');
const ciConfig = require('./ci');

const ENV = process.env.NODE_ENV || 'development';

let currentConfig;

switch (ENV) {
  case 'production':
    currentConfig = prodConfig;
    break;
  case 'ci':
    currentConfig = ciConfig;
    break;
  case 'development':
    currentConfig = devConfig;
    break;
  default:
    currentConfig = devConfig;
    break;
}

module.exports = currentConfig;
