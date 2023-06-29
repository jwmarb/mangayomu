var path = require('path');
var babel = require('@babel/core');
var globalPath = require('path');
var fs = require('fs/promises');
var DEV_PATH = path.resolve(__dirname, 'app', 'api');
var VERCEL_PATH = path.resolve(__dirname, 'api');
var { println, compile } = require('./util');

/**
 * Extract all files from a path
 * @param {string} path The path to extract files from
 * @param {string | undefined} extension Extract those that end with extension
 * @returns {Promise<string[]>}
 */
function files(path, extension) {
  return new Promise(function (resolve) {
    fs.readdir(path).then(function (childPaths) {
      return Promise.all(
        childPaths.map(function (childPath) {
          return new Promise(function (resolveChildPath) {
            var parsedChildPath = globalPath.resolve(
              __dirname,
              path,
              childPath,
            );
            fs.stat(parsedChildPath).then(function (stat) {
              if (stat.isDirectory()) {
                files(parsedChildPath, extension).then(function (results) {
                  resolveChildPath(results);
                });
              } else {
                if (extension == null) return resolveChildPath(parsedChildPath);
                else if (parsedChildPath.endsWith(extension))
                  resolveChildPath(parsedChildPath);
                else resolveChildPath();
              }
            });
          });
        }),
      ).then(function (paths) {
        resolve(paths.filter(Boolean).flat());
      });
    });
  });
}

/**
 * Transforms all .ts code into commonjs code
 * @param {string[]} files
 * @returns {Promise<{ path: string, code: string }[]>}
 */
function transformAll(files) {
  return new Promise(function (res) {
    println(
      `Compiling ${files.length} files into "${VERCEL_PATH.replace(
        __dirname,
        '',
      )}"...`,
    );
    Promise.all(
      files.map(function (file) {
        return new Promise(function (res2) {
          compile(file).then(function (code) {
            var path = file.replace(DEV_PATH, VERCEL_PATH);
            var withJsExtension = path.substring(0, path.length - 3) + '.js';
            res2({
              path: withJsExtension,
              code,
            });
          });
        });
      }),
    ).then(function (results) {
      res(results);
    });
  });
}

/**
 * Writes all pending files to the file system
 * @param {{ path: string, code: string }[]} pendingToBeWritten
 */
function writeAll(pendingToBeWritten) {
  return new Promise(function (res) {
    Promise.all(
      pendingToBeWritten.map(function (pendingFile) {
        return new Promise(function (res2) {
          fs.writeFile(pendingFile.path, pendingFile.code, {
            encoding: 'utf-8',
          }).then(function () {
            res2();
          });
        });
      }),
    ).then(function () {
      res();
    });
  });
}

println('Gathering all API files for compilation...');
files(DEV_PATH, '.ts').then(function (files) {
  var s = performance.now();
  transformAll(files).then(function (transformed) {
    writeAll(transformed).then(function () {
      var e = performance.now();
      println(`Finished compiling API in ${Math.round(e - s)}ms`);
      process.exit(0);
    });
  });
});
