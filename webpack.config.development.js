/**

Merge webpack.config and override necessary values
to reflect development environment and point to the correct output path
*/
const { merge } = require("webpack-merge");
const path = require("path");
const config = require("./webpack.config");
module.exports = merge(config, {
  mode: "development", // set the mode of the configuration
  devtool: "inline-source-map", // enable source code mapping

  devServer: {
    devMiddleware: {
      writeToDisk: true, // allows individual files to be written to disk (ie.devServer.contentBase)
    },
  },
  output: {
    path: path.resolve(__dirname, "public"), // set the output path for compiled bundles
  },
});
