const path = require('path');
const globalPath = require('path');
const fs = require('fs/promises');
const fsSync = require('fs');
const DEV_PATH = path.resolve(__dirname, 'src', 'api');
const DEV_SRC_PATH = path.resolve(__dirname, 'src');
const DEV_DIST_PATH = path.resolve(__dirname, 'dist');
const VERCEL_PATH = path.resolve(__dirname, '..', 'nextjs', 'api', 'v1');
const { println, compile } = require('./util');

/**
 * Extract all files from a path
 * @param {string} path The path to extract files from
 * @param {string | undefined} extension Extract those that end with extension
 * @param {string | undefined} excludeFolder Folder to exclude from being read
 * @returns {Promise<string[]>}
 */
async function files(path, extension, excludeFolder) {
  const childPaths = await fs.readdir(path);
  const p = await Promise.all(
    childPaths.map(async (childPath) => {
      const parsedChildPath = globalPath.resolve(__dirname, path, childPath);
      const stat = await fs.stat(parsedChildPath);

      if (stat.isDirectory() && excludeFolder !== parsedChildPath)
        return files(parsedChildPath, extension, excludeFolder);
      else {
        if (extension == null) return parsedChildPath;
        else if (parsedChildPath.endsWith(extension)) return parsedChildPath;
        else return undefined;
      }
    }),
  );

  return p.filter(Boolean).flat();
}

/**
 * Transforms all .ts code into commonjs code
 * @param {string[]} files
 * @param {string} fromPath
 * @param {string} toPath
 * @returns {Promise<{ path: string, code: string }[]>}
 */
async function transformAll(files, fromPath, toPath) {
  println(
    `Compiling ${files.length} files into "${toPath.replace(
      __dirname,
      '',
    )}"...`,
  );

  const results = await Promise.all(
    files.map(async (file) => {
      const code = await compile(file);
      const path = file.replace(fromPath, toPath);
      const withJsExtension = path.substring(0, path.length - 3) + '.js';
      return {
        path: withJsExtension,
        code,
      };
    }),
  );

  return results;
}

/**
 * Writes all pending files to the file system
 * @param {{ path: string, code: string }[]} pendingToBeWritten
 */
async function writeAll(pendingToBeWritten) {
  for (let i = 0; i < pendingToBeWritten.length; i++) {
    const pendingFile = pendingToBeWritten[i];
    if (!fsSync.existsSync(pendingFile.path))
      await fs.mkdir(
        pendingFile.path.substring(0, pendingFile.path.lastIndexOf('\\')),
        { recursive: true },
      );
    await fs.writeFile(pendingFile.path, pendingFile.code, {
      encoding: 'utf-8',
    });
  }
}

async function main() {
  try {
    println('Gathering all API files for compilation...');
    const [found, srcFiles] = await Promise.all([
      await files(DEV_PATH, '.ts'),
      await files(DEV_SRC_PATH, '.ts', DEV_PATH),
    ]);
    const s = performance.now();
    const [transformedApi, transfomredSrc] = await Promise.all([
      await transformAll(found, DEV_PATH, VERCEL_PATH),
      await transformAll(srcFiles, DEV_SRC_PATH, DEV_DIST_PATH),
    ]);
    await Promise.all([
      await writeAll(transformedApi),
      await writeAll(transfomredSrc),
    ]);
    const e = performance.now();
    println(`Finished compiling API in ${Math.round(e - s)}ms`);
  } catch (e) {
    println(e);
  } finally {
    process.exit(0);
  }
}

main();
