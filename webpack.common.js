const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js",
    article: "./src/article.js",
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/images",
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      chunks: ["index"],
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/article.html",
      chunks: ["article"],
      filename: "article.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/nav.html",
      chunks: ["nav"],
      filename: "nav.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/manifest.json", to: "./manifest.json" },
        { from: "./src/assets/images/icons", to: "./assets/images/icons" },
        { from: "./src/sw.js", to: "./sw.js" },
        { from: "./src/pages", to: "./pages" },
      ],
    }),
  ],
};
