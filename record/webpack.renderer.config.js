const rules = require('./webpack.rules');
const config = require('./webpack.config');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  ...config,
  module: {
    rules,
  },
};
