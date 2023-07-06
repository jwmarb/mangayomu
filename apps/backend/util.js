const babel = require('@babel/core');

/**
 * @type {import('@babel/core').TransformOptions}
 */
const babelOptions = {
  presets: [
    ['@babel/preset-env', { modules: 'commonjs' }],
    '@babel/preset-typescript',
  ],
  // plugins: [
  //   [
  //     'module-resolver',
  //     {
  //       root: './src/api',
  //       alias: {
  //         '@main': '@mangayomu/backend',
  //       },
  //     },
  //   ],
  // ],
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
  const date = new Date();
  const period = date.getHours() > 12 ? 'PM' : 'AM';
  const hour = date.getHours();
  const min = date.getMinutes();
  const seconds = date.getSeconds();
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
      res(c.code.replace('require("@main")', 'require("@mangayomu/backend")'));
    });
  });
}

exports.println = println;
exports.compile = compile;
