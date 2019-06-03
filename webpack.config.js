const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const { ReactLoadablePlugin } = require("react-loadable/webpack")
const path = require("path")

module.exports = {
  entry: "./src/prod.js",
  mode: "production",
  optimization: {
    minimize: true
  },
  target: "webworker",
  output: {
    path: __dirname + "/bundles",
    publicPath: "bundles/",
    filename: "worker.js",
    chunkFilename: "[name].js"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "[name].css"
    }),
    new ReactLoadablePlugin({
      filename: "./bundles/modules.json"
    })
  ],
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
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
            plugins: ["@babel/plugin-syntax-dynamic-import", "react-loadable/babel"]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + "/"
              }
            }
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[folder]_[local]--[hash:base64:3]"
            }
          }
        ]
      }
    ]
  }
}
