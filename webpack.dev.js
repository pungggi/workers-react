const webpack = require("webpack")

module.exports = {
  entry: "./src/dev.js",
  mode: "development",
  output: {
    path: __dirname + "/bundles",
    publicPath: "/",
    filename: "dev-bundle.js"
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: "./bundles",
    historyApiFallback: true,
    hot: true
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
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader"
      },
      {
        test: /\.css$/,
        loader: "css-loader",
        query: {
          modules: true,
          localIdentName: "[name]_[local]__[hash:base64:3]"
        }
      }
    ]
  }
}
