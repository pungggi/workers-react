const MiniCssExtractPlugin = require("mini-css-extract-plugin")
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
    filename: "worker.js"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "[id].css"
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
            presets: ["@babel/preset-react"]
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
