import { Manga } from '@mangayomu/mangascraper';
import { getErrorMessage, isManga, isUnparsedManga } from '@/utils/helpers';

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
  });
});

describe('isUnparsedManga', () => {
  expect(isUnparsedManga({})).toBeFalsy();
  expect(isUnparsedManga({ __source__: '' })).toBeTruthy();
});
