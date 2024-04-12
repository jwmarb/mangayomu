import fsPromises from 'fs/promises';
import fs from 'fs';
import nodePath from 'path';
import type {
  Dirs,
  FetchBlobResponse,
  ReactNativeBlobUtilConfig,
  ReactNativeBlobUtilStat,
} from 'react-native-blob-util';

export class MockBlobUtil {
  static throttleFetch = false;

  static shouldThrottleFetch(value: boolean) {
    MockBlobUtil.throttleFetch = value;
  }
}

function dir(path: string) {
  const a = nodePath.resolve(path);
  if (!fs.existsSync(a)) {
    fs.mkdirSync(a);
  }
  return a;
}

const unlink = jest.fn(async (path: string) => {
  const stack = [path];
  const dirs: string[] = [];
  const files = [];

  while (stack.length > 0) {
    const file = stack.pop();
    if (!file || !fs.existsSync(file)) continue;
    try {
      const lstat = await fsPromises.lstat(file);
      if (lstat.isDirectory()) {
        stack.push(
          ...(await fsPromises.readdir(file)).map((x) =>
            nodePath.join(file, x),
          ),
        );
        dirs.push(file);
      } else if (lstat.isFile()) {
        files.push(file);
      }
    } catch (e) {
      console.log('nope');
    }
  }

  await Promise.allSettled(files.map((file) => fsPromises.unlink(file)));

  while (dirs.length > 0) {
    const dir = dirs.pop();
    if (!dir) continue;
    await fsPromises.rm(dir, { recursive: true, force: true });
  }
});

const DEFAULT_PATH = dir('.tmp');

const dirs: Dirs = {
  ...({} as Dirs),
  CacheDir: dir('.tmp/Cache'),
  DCIMDir: dir('.tmp/DCIM'),
  DocumentDir: dir('.tmp/Documents'),
  DownloadDir: dir('.tmp/Downloads'),
};

const stat = jest.fn(async (path: string): Promise<ReactNativeBlobUtilStat> => {
  const f = await fsPromises.stat(path);
  return {
    filename: path.substring(path.lastIndexOf('/') + 1),
    path,
    size: f.size,
    type: f.isDirectory() ? 'directory' : 'file',
    lastModified: f.mtimeMs,
  };
});

const lstat = jest.fn((path: string) =>
  Promise.all(
    fs.readdirSync(path).map(async (x): Promise<ReactNativeBlobUtilStat> => {
      const f = await stat(nodePath.resolve(path, x));
      return {
        filename: x,
        path,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified,
      };
    }),
  ),
);

const exists = jest.fn((path: string) => {
  const value = fs.existsSync(path);
  return Promise.resolve(value);
});

const ls = jest.fn((path: string) => fsPromises.readdir(path));

const cp = jest.fn((srcFile: string, dest: string) =>
  fsPromises.cp(srcFile, dest),
);

const mkdir = jest.fn((path: string) => fsPromises.mkdir(path));

const mv = jest.fn(async (path: string, dest: string) => {
  try {
    await fsPromises.rename(path, dest);
    return true;
  } catch (e) {
    return false;
  }
});

beforeEach(async () => {
  await unlink(DEFAULT_PATH);
  await fsPromises.mkdir(DEFAULT_PATH);
  for (const key in dirs) {
    const directory = dirs[key as keyof Dirs];
    await fsPromises.mkdir(directory);
  }
});

// afterAll(async () => {
//   try {
//     await unlink(DEFAULT_PATH);
//   } catch (e) {
//     console.log('couldnt remove');
//   }
// });

export default {
  fs: {
    exists,
    unlink,
    readdir: fsPromises.readdir,
    mkdir,
    appendFile: fsPromises.appendFile,
    writeFile: fsPromises.writeFile,
    readFile: fsPromises.readFile,
    mv,
    cp,
    stat,
    dirs,
    ls,
    lstat,
  },
  config: jest.fn((options: ReactNativeBlobUtilConfig) => ({
    fetch: (method: 'GET', url: string) => {
      return fetch(url, { method })
        .then(async (response) => {
          const resHeaders: Record<string, unknown> = {};
          for (const key of response.headers.keys()) {
            resHeaders[key] = response.headers.get(key);
          }
          // const info = {
          //   ...response,
          //   statusCode: response.status,
          //   status: response.status,
          //   url: response.url || url,
          //   headers: resHeaders,
          //   contentLength: response.headers.get('content-length')
          // };
          if (response.ok && response.body != null) {
            const writer = fs.createWriteStream(options.path ?? DEFAULT_PATH, {
              flags: options.overwrite ?? true ? undefined : 'a',
            });
            const reader = response.body.getReader();

            if (MockBlobUtil.throttleFetch) {
              await new Promise<void>((res) =>
                setTimeout(() => {
                  res();
                }, 1000),
              );
            }
            for (;;) {
              const { value, done } = await reader.read();
              if (done) {
                writer.close();
                break;
              }
              writer.write(value);
            }
          }
          return response;
        })
        .then(
          (a): FetchBlobResponse => ({
            ...({} as FetchBlobResponse),
            info: () => ({
              ...({} as ReturnType<FetchBlobResponse['info']>),
              status: a.status,
            }),
            path: () => options.path ?? DEFAULT_PATH,
          }),
        );
    },
  })),
};
