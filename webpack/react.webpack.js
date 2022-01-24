const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = path.resolve(__dirname, '..');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser'],
  },
  entry: path.resolve(rootPath, 'src', 'App.tsx'),
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        // Taken from here: https://github.com/ant-design/ant-design-dark-theme/issues/8#issuecomment-807834949
        test: /\.theme\.less$/i,
        use: [
          {
            loader: 'style-loader',
            options: { injectType: 'lazyStyleTag' },
          },
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                // env: mode,
                javascriptEnabled: true,
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /\.theme\.(less|css)$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                // This is an alternate, easier way of theming
                // I'll leave this here just in case for testing
                // modifyVars: {
                  // 'primary-color': '#fcb03b',
                  // 'link-color': '#fcb03b',
                  // 'border-radius-base': '2px',
                  // 'layout-header-background': '#fcb03b'
                // },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(rootPath, 'dist/renderer'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    host: '0.0.0.0',
    port: 4000,
    publicPath: '/',
  },
  output: {
    path: path.resolve(rootPath, 'dist/renderer'),
    filename: 'js/[name].js',
    publicPath: './',
  },
  plugins: [new HtmlWebpackPlugin()],
};
