import {
  InvalidSourceException,
  Manga,
  MangaSee,
} from '@mangayomu/mangascraper';
import useMangaSource from '@/hooks/useMangaSource';

test('gets source from unparsed manga', () => {
  const manga = { __source__: MangaSee.NAME };
  expect(useMangaSource({ manga })).toEqual(MangaSee);
});

test('gets source from manga', () => {
  const manga: Manga = { source: MangaSee.NAME, title: '', link: '' };
  expect(useMangaSource({ manga })).toEqual(MangaSee);
});

test('gets source from source string', () => {
  expect(useMangaSource({ source: MangaSee.NAME })).toEqual(MangaSee);
});

test('invalid source from unparsed manga', () => {
  const manga = { __source__: '' };
  expect(() => useMangaSource({ manga })).toThrow(InvalidSourceException);
});

test('invalid source from manga', () => {
  const manga: Manga = { source: 'Invalid', title: '', link: '' };
  expect(() => useMangaSource({ manga })).toThrow(InvalidSourceException);
});

test('invalid source from source string', () => {
  expect(() => useMangaSource({ source: '' })).toThrow(InvalidSourceException);
});
