const path = require('path');
const globalPath = require('path');
const fs = require('fs/promises');
const fsSync = require('fs');
const DEV_PATH = path.resolve(__dirname, 'src', 'api');
const VERCEL_PATH = path.resolve(__dirname, '..', 'nextjs', 'api', 'v1');
const { println, compile } = require('./util');

/**
 * Extract all files from a path
 * @param {string} path The path to extract files from
 * @param {string | undefined} extension Extract those that end with extension
 * @returns {Promise<string[]>}
 */
async function files(path, extension) {
  const childPaths = await fs.readdir(path);
  const p = await Promise.all(
    childPaths.map(async (childPath) => {
      const parsedChildPath = globalPath.resolve(__dirname, path, childPath);
      const stat = await fs.stat(parsedChildPath);

      if (stat.isDirectory()) return files(parsedChildPath, extension);
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
 * @returns {Promise<{ path: string, code: string }[]>}
 */
async function transformAll(files) {
  println(
    `Compiling ${files.length} files into "${VERCEL_PATH.replace(
      __dirname,
      '',
    )}"...`,
  );

  const results = await Promise.all(
    files.map(async (file) => {
      const code = await compile(file);
      const path = file.replace(DEV_PATH, VERCEL_PATH);
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
    const found = await files(DEV_PATH, '.ts');
    const s = performance.now();
    const transformed = await transformAll(found);
    await writeAll(transformed);
    const e = performance.now();
    println(`Finished compiling API in ${Math.round(e - s)}ms`);
  } catch (e) {
    println(e);
  } finally {
    process.exit(0);
  }
}

main();
