// Set the mode to production
const mode = "production";

// Use path to create the output path
const path = require("path");

// Require CleanWebpackPlugin to clean up generated files in the output folder
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// Merge with existing webpack configuration
const { merge } = require("webpack-merge");
const config = require("./webpack.config");

// Merge the existing webpack configuration with the settings listed below
module.exports = merge(config, {
  mode,
  output: {
    path: path.join(__dirname, "public"),
  },
  plugins: [new CleanWebpackPlugin()], // removes all unused webpack assets and chunks
});
