var fs = require('fs/promises');
var fsSync = require('fs');
var globalPath = require('path');
var VERCEL_PATH = globalPath.resolve(__dirname, 'api');
var TEMP_PATH = globalPath.resolve(__dirname, '.tmp');
var DEV_PATH = globalPath.resolve(__dirname, 'app/api');
var log = Boolean(process.argv[2]);

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
  if (log) {
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
}

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
 * Masks path
 * @param {string[]} filePaths
 * @param {string} path
 * @param {string} toPath
 */
function mirror(filePaths, path, toPath) {
  return filePaths.map(function (filePath) {
    return filePath.replace(path, toPath);
  });
}

/**
 *
 * @param {string[]} filePaths
 * @param {string} fromPath
 * @param {string} toPath
 */
function copyFiles(filePaths, fromPath, toPath) {
  var copiedPaths = mirror(filePaths, fromPath, toPath);
  for (var i = 0; i < filePaths.length; i++) {
    var copy = copiedPaths[i];
    var original = filePaths[i];
    fsSync.copyFileSync(original, copy, fs.constants.COPYFILE_FICLONE);
    println(
      `Copied ${original.replace(__dirname, '')} to ${copy.replace(
        __dirname,
        '',
      )}`,
    );
  }
}

var tempFiles = fsSync.readdirSync(TEMP_PATH);
if (tempFiles.length > 0) {
  println(
    `Detected ${tempFiles.length} file change${
      tempFiles.length === 1 ? '' : 's'
    }`,
  );
  Promise.all([
    files(TEMP_PATH, '.js'),
    files(DEV_PATH, '.ts'),
    files(VERCEL_PATH, '.js'),
  ]).then(function ([temp, dev, vercel]) {
    var allOriginalFiles = new Set(
      mirror(dev, DEV_PATH, VERCEL_PATH).map(function (original) {
        return original.substring(0, original.length - 3) + '.js';
      }),
    );
    var filesForDeletion = [];
    for (var i = 0; i < vercel.length; i++) {
      if (!allOriginalFiles.has(vercel[i])) filesForDeletion.push(vercel[i]);
    }
    copyFiles(temp, TEMP_PATH, VERCEL_PATH);
    for (var i = 0; i < filesForDeletion.length; i++) {
      println(
        `Deleted ${filesForDeletion[i].replace(
          __dirname,
          '',
        )} because it was renamed or removed`,
      );
      fsSync.rmSync(filesForDeletion[i]);
    }
    fsSync.readdir(TEMP_PATH, function (err, files) {
      if (err) throw err;
      for (var i = 0; i < files.length; i++) {
        fsSync.rmSync(globalPath.join(TEMP_PATH, files[i]), {
          recursive: true,
        });
      }
      process.exit(0);
    });
  });
} else println('Ready and watching for changes in app/api.');
