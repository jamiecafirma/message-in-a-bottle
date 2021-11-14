require('dotenv/config');
const path = require('path');
const webpack = require('webpack');

const clientPath = path.join(__dirname, 'client');
const serverPublicPath = path.join(__dirname, 'server/public');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: clientPath,
  output: {
    path: serverPublicPath
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: clientPath,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-transform-react-jsx'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(['SPOTIFY_CLIENT_ID', 'SPOTIFY_AUTH_CALLBACK_SENDER', 'SPOTIFY_AUTH_CALLBACK_RECIPIENT'])
  ],
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: process.env.DEV_SERVER_PORT,
    historyApiFallback: true,
    static: {
      directory: serverPublicPath,
      publicPath: '/',
      watch: {
        ignored: path.join(serverPublicPath, 'images')
      }
    },
    proxy: {
      '/api': `http://localhost:${process.env.PORT}`
    }
  },
  stats: 'summary',
  performance: {
    hints: false
  }
};
