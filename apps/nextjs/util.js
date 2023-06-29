var babel = require('@babel/core');

/**
 * @type {import('@babel/core').TransformOptions}
 */
var babelOptions = {
  presets: [
    ['@babel/preset-env', { modules: 'commonjs' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app/api'],
        alias: {
          '@server': './app/api',
        },
      },
    ],
  ],
};

function format(n) {
  if (n < 10) return `0${n}`;
  return n;
}

function formatHours(n) {
  if (n > 12) return n - 12;
  return n;
}

/**
 *
 * @param {string} input
 */
function println(input) {
  var date = new Date();
  var period = date.getHours() > 12 ? 'PM' : 'AM';
  var hour = date.getHours();
  var min = date.getMinutes();
  var seconds = date.getSeconds();
  console.log(
    `${formatHours(hour)}:${format(min)}:${format(
      seconds,
    )} ${period} - ${input}`,
  );
}

/**
 *
 * @param {string} tsPath The path of the .ts file
 * @returns {Promise<string>} Returns compiled code
 */
function compile(tsPath) {
  return new Promise(function (res) {
    babel.transformFileAsync(tsPath, babelOptions).then(function (c) {
      res(c.code);
    });
  });
}

exports.println = println;
exports.compile = compile;
