const CleanWebpackPlugin = require("clean-webpack-plugin");
const workboxPlugin = require("wrkbx");

module.exports = {
  entry: "./src/prod.js",
  mode: "production",
  optimization: {
    minimize: true
  },
  output: {
    path: __dirname + "/bundles",
    publicPath: "bundles/",
    filename: "prebundle.js"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new workboxPlugin.InjectManifest({
      exclude: ["prebundle.js"],
      swSrc: "prebundle.js",
      entry: __dirname + "/src/serviceworker/template.js",
      swDest: "worker.js"
    })
  ],
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
