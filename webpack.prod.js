module.exports = {
  entry: "./src/index.js",
  mode: "production",
  optimization: {
    minimize: true
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "dist",
    filename: "worker.js"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: "javascript/auto",
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      }
    ]
  }
};
