const merge = require("webpack-merge");
const base = require("./base");
const devServer = require("./devServer");


module.exports = merge(base, devServer);