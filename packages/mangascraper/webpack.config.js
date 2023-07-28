const path = require('path');
module.exports = {
  entry: './dist/src/index.js',
  output: {
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, 'bundle'),
    filename: 'index.bundle.js',
  },
};
