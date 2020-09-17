const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.ttf$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets',
            },
          },
        ],
      },
      {
        test: /\.(gif|png|ico|svg|jpe?g)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              webp: {
                enabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
  ],
};
