const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./src/dev.js",
  mode: "development",
  output: {
    path: __dirname + "/bundles",
    publicPath: "/",
    filename: "dev-bundle.js",
    chunkFilename: "[name].js"
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/dev.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: "./bundles",
    historyApiFallback: true,
    hot: true
  },
  resolve: {
    alias: {
      state: path.resolve("./src/store"),
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
            presets: ["@babel/preset-react"],
            plugins: ["@babel/plugin-syntax-dynamic-import"]
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
          localIdentName: "[folder]_[local]--[hash:base64:3]"
        }
      }
    ]
  }
};
