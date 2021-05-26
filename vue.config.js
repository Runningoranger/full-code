
const exec = require('child_process').execSync;
process.env.VUE_APP_NAME = require('./package.json').name;
process.env.VUE_APP_VERSION = require('./package.json').version;
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss');
process.env.VUE_APP_GIT_COMMIT = exec('git rev-parse --short HEAD').toString().trim();


module.exports = require("./configs");