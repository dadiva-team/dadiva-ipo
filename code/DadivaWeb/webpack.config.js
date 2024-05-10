const ESLintPlugin = require('eslint-webpack-plugin');

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  mode: 'development',
  devServer: {
    port: 8000,
    historyApiFallback: true,
    compress: false,
    proxy: [
      {
        context: ['/api'],
        target: 'https://localhost:7011',
        // introducing an API delay to make testing easier
        pathRewrite: async function (path) {
          await delay(1000);
          return path;
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ['file-loader?name=[name].[ext]'], // ?name=[name].[ext] is only necessary to preserve the original file name
      },
    ],
  },
};
