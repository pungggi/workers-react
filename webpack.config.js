module.exports = {
  entry: "./src/prod.js",
  mode: "production",
  optimization: {
    minimize: true
  },
  output: {
    path: __dirname + "/bundles",
    publicPath: "bundles/",
    filename: "worker.js"
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat"
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
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
