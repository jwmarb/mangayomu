const path = require('path');
const fs = require('fs');
const watch = require('watch');
const DEV_API_ROUTE_PATH = path.resolve(__dirname, 'src', 'api');
const DEV_SRC_PATH = path.resolve(__dirname, 'src');
const DEV_DIST_PATH = path.resolve(__dirname, 'dist');
const VERCEL_PATH = path.resolve(__dirname, '..', 'nextjs', 'api', 'v1');
const { println, compile } = require('./util');

/**
 * Convert file's DEV_PATH to VERCEL_PATH
 * @param {string} devPathFile
 * @returns {string} Returns the output path
 */
function getOutputPath(devPathFile) {
  const newPath = devPathFile.replace(DEV_API_ROUTE_PATH, VERCEL_PATH);
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

function pathOnly(file) {
  const i = file.lastIndexOf('\\');
  return file.substring(0, i);
}

/**
 * Compile file that is in ./src into ./dist as .js file
 * @param {string} srcPathFile
 */
function getDistPath(srcPathFile) {
  const newPath = srcPathFile.replace(DEV_SRC_PATH, DEV_DIST_PATH);
  return newPath.substring(0, newPath.length - 3) + '.js';
}

watch.createMonitor('./src', { interval: 1 }, async function (monitor) {
  println('Watching for file changes in ./src ...');
  monitor.on('changed', async function (_) {
    const file = __dirname + '\\' + _;
    const filePath = pathOnly(file);
    const isSrcDirectory = filePath === DEV_SRC_PATH;
    const writeToPath = isSrcDirectory
      ? getDistPath(file)
      : getOutputPath(file);
    const code = await compile(file);
    println(`Modified ${_}`);
    fs.writeFileSync(writeToPath, code, { encoding: 'utf-8' });
  });
  monitor.on('created', async function (_) {
    const file = __dirname + '\\' + _;
    const filePath = pathOnly(file);
    const isSrcDirectory = filePath === DEV_SRC_PATH;
    if (isSrcDirectory) {
      // compile to ./dist
      const writeToPath = getDistPath(file);
      const code = await compile(file);
      println(`Created ${_}`);
      fs.writeFileSync(writeToPath, code, { encoding: 'utf-8' });
    } else {
      // compile to ../nextjs/api
      const writeToPath = getOutputPath(file);
      createDirectoryIfNotExist(writeToPath);
      const code = await compile(file);
      println(`Created ${_}`);
      fs.writeFileSync(writeToPath, code, { encoding: 'utf-8' });
    }
  });
  monitor.on('removed', function (_) {
    const file = __dirname + '\\' + _;
    const filePath = pathOnly(file);
    const isSrcDirectory = filePath === DEV_SRC_PATH;
    const deletePath = isSrcDirectory ? getDistPath(file) : getOutputPath(file);
    println(`Deleted ${_}`);
    fs.rmSync(deletePath, { force: true });
  });
});
