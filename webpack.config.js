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
    new webpack.EnvironmentPlugin(['REACT_APP_SPOTIFY_CLIENT_ID'])
  ],
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: process.env.DEV_SERVER_PORT,
    historyApiFallback: true,
    static: {
      directory: serverPublicPath,
      publicPath: '/',
      watch: true
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
