const webpack = require("webpack");

module.exports = {
  entry: "./src/dev.js",
  mode: "development",
  output: {
    path: __dirname + "/dev",
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: "./dev",
    historyApiFallback: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js"]
  }
};
