/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",
  devServer: {
    static: './dist',
    hot: false,
  },
  mode: 'development',
	plugins: [
		new HtmlWebpackPlugin({
      title: '#',
      template: 'src/index.html'
    }),
	],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
  optimization: {
    runtimeChunk: 'single',
  },
};
