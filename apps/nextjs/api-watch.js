var path = require('path');
var fs = require('fs');
var watch = require('watch');
var DEV_PATH = path.resolve(__dirname, 'app', 'api');
var VERCEL_PATH = path.resolve(__dirname, 'api');
var { println, compile } = require('./util');

/**
 * Convert file's DEV_PATH to VERCEL_PATH
 * @param {string} devPathFile
 * @returns {string} Returns the output path
 */
function getOutputPath(devPathFile) {
  var newPath = devPathFile.replace(DEV_PATH, VERCEL_PATH);
  return newPath.substring(0, newPath.length - 3) + '.js';
}

/**
 * Creates a directory to the path, if the directories do not exist
 * @param {string} path
 */
function createDirectoryIfNotExist(path) {
  const pathToCreate = path.substring(0, path.lastIndexOf('\\'));
  if (!fs.existsSync(pathToCreate)) fs.mkdirSync(pathToCreate);
}

watch.createMonitor('./app/api', { interval: 1 }, function (monitor) {
  println('Watching for file changes in ./app/api ...');
  monitor.on('changed', function (_) {
    var file = __dirname + '\\' + _;
    var writeToPath = getOutputPath(file);
    compile(file).then(function (code) {
      println(`Modified ${_}`);
      fs.writeFileSync(writeToPath, code, { encoding: 'utf-8' });
    });
  });
  monitor.on('created', function (_) {
    var file = __dirname + '\\' + _;
    var writeToPath = getOutputPath(file);
    createDirectoryIfNotExist(writeToPath);
    compile(file).then(function (code) {
      println(`Created ${_}`);
      fs.writeFileSync(writeToPath, code, { encoding: 'utf-8' });
    });
  });
  monitor.on('removed', function (_) {
    var file = __dirname + '\\' + _;
    var deletePath = getOutputPath(file);
    println(`Deleted ${_}`);
    fs.rmSync(deletePath, { force: true });
  });
});
