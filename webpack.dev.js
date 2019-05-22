module.exports = {
  entry: "./src/dev.js",
  mode: "development",
  output: {
    path: __dirname + "/dev",
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "./dev"
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
