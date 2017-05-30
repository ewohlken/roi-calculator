const path = require('path');
const webpack = require('webpack');

const config = {
  dir : {
    root: __dirname
  }
};

config.dir.build = path.resolve(config.dir.root, 'build');
config.dir.src  = path.resolve(config.dir.root, 'src');
config.dir.entry = path.resolve(config.dir.src, 'js');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    './src/js/main.jsx'
  ],
  output: {
    path: config.dir.build,
    filename: 'app.bundle.js'
  },
  resolve: {
    extensions: [".js", ".json", ".jsx"]
  },
  devtool: 'source-map',
  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: config.dir.src,
    // match the output path

    publicPath: '/build'
    // match the output `publicPath`
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader' //?cacheDirectory
      }
    //   {
    //    test: /\.css$/,
    //    use: [ 'style-loader', 'css-loader?modules'],
    //  },
    //  {
    //     test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
    //     loader: 'url-loader',
    //     options: {
    //       limit: 10000
    //     }
    //   }
    ]
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'WEBPACK_ENV': '"dev"'
    })
    // prints more readable module names in the browser console on HMR updates

    // new HtmlWebpackPlugin({
    //   template: path.resolve(config.dir.src, 'index.template.ejs'),
    //   inject: 'body'
    // })
  ]
};
