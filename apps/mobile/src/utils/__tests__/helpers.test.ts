import { Manga } from '@mangayomu/mangascraper';
import {
  getErrorMessage,
  isManga,
  isUnparsedManga,
  joinPath,
} from '@/utils/helpers';

describe('getErrorMessage', () => {
  it('extracts error correctly', () => {
    expect(getErrorMessage(new Error('a'))).toEqual('a');
    expect(getErrorMessage({ message: 'a' })).toEqual('a');
    expect(getErrorMessage({ stack: 'a' })).toEqual('a');
    expect(getErrorMessage({ msg: 'a' })).toEqual('a');
    expect(getErrorMessage('a')).toEqual('a');
    expect(getErrorMessage({})).toEqual(
      'No error code/message has been provided',
    );
    expect(getErrorMessage(null)).toEqual(
      'No error code/message has been provided',
    );
    expect(getErrorMessage(undefined)).toEqual(
      'No error code/message has been provided',
    );
  });

  it('returns default message for unknown errors', () => {
    const customError = new Error();
    expect(getErrorMessage(customError)).toEqual(customError.stack);

    const customError2 = { not: 'a' } as any;
    delete (customError2 as any).message;
    expect(getErrorMessage(customError2)).toEqual(
      'No error code/message has been provided',
    );
  });
});

describe('isManga', () => {
  it('correctly parses object', () => {
    expect(isManga(null)).toBeFalsy();
    expect(isManga({})).toBeFalsy();
    expect(
      isManga({
        title: '',
        imageCover: '',
        link: '',
        source: '',
      } as Manga),
    ).toBeTruthy();
    expect(
      isManga({
        title: '',
        imageCover: '',
        link: '',
        source: '',
        language: 'en',
      } as Manga),
    ).toBeTruthy();
    expect(
      isManga({
        title: '',
        imageCover: null,
        link: '',
        source: '',
      } as Manga),
    ).toBeTruthy();
    expect(
      isManga({
        title: '',
        link: '',
        source: '',
      } as Manga),
    ).toBeTruthy();
    expect(isManga({} as any)).toBeFalsy();
  });
});

describe('isUnparsedManga', () => {
  expect(isUnparsedManga({})).toBeFalsy();
  expect(isUnparsedManga({ __source__: '' })).toBeTruthy();

  expect(isUnparsedManga(null)).toBeFalsy();
  expect(isUnparsedManga(undefined)).toBeFalsy();
});

describe('joinPaths', () => {
  it('joins empty path', () => {
    expect(joinPath('')).toEqual('');
  });

  it('joins two paths', () => {
    expect(joinPath('root', 'child')).toEqual('root/child');
    expect(joinPath('root', '/child')).toEqual('root/child');
    expect(joinPath('root/', '/child')).toEqual('root/child');
    expect(joinPath('root/', 'child')).toEqual('root/child');
  });
  it('joins completed path', () => {
    expect(joinPath('root/child')).toEqual('root/child');
    expect(joinPath('root/child/')).toEqual('root/child');
    expect(joinPath('root/child/', 'hello/world')).toEqual(
      'root/child/hello/world',
    );
    expect(joinPath('root/child/', 'hello', '/world')).toEqual(
      'root/child/hello/world',
    );
  });
  it('real os paths', () => {
    expect(
      joinPath('C:', 'Users/', 'You', '/test', '/hello_world.png'),
    ).toEqual('C:/Users/You/test/hello_world.png');
  });

  it('joins empty string paths', () => {
    expect(joinPath('/')).toEqual('');
    expect(joinPath('/', '')).toEqual('/');
    expect(joinPath('/', '', '')).toEqual('/');
    expect(joinPath('/', '', 'hello')).toEqual('/hello');
    expect(joinPath('', '/', 'hello')).toEqual('/hello');
  });

  it('joins invalid paths', () => {
    expect(joinPath('/', '/', '/', 'hello')).toEqual('/hello');
    expect(joinPath('', '/', 'hello')).toEqual('/hello');
    expect(joinPath('', '/', 'hello', '', '/', '/', '/whats-up')).toEqual(
      '/hello/whats-up',
    );
  });
});
