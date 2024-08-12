import determinePageBoundaries from '@/screens/Reader/helpers/determinePageBoundaries';
import { MangaChapter } from '@mangayomu/mangascraper';

function generateMockChapter(idx: number): MangaChapter {
  return {
    date: Date.now(),
    link: `https://${idx.toString()}`,
    name: `Chapter ${idx}`,
    index: 0,
  };
}

it('correctly determines page boundaries for 1 chapter', () => {
  expect(
    determinePageBoundaries([
      { chapter: generateMockChapter(0), pages: ['1', '2', '3'] },
    ]),
  ).toEqual({
    'https://0': [0, 2],
  });
});

it('correctly determines page boundaries for 2 chapters', () => {
  expect(
    determinePageBoundaries([
      { chapter: generateMockChapter(0), pages: ['1', '2', '3'] },
      { chapter: generateMockChapter(1), pages: ['1', '2', '3'] },
    ]),
  ).toEqual({
    'https://0': [0, 2],
    'https://1': [4, 6],
  });
});

it('correctly determines page boundaries for 4 chapters of varied page lengths', () => {
  expect(
    determinePageBoundaries([
      { chapter: generateMockChapter(0), pages: ['1', '2', '3'] },
      { chapter: generateMockChapter(1), pages: ['1', '2', '3', '4'] },
      { chapter: generateMockChapter(2), pages: ['1', '2', '3', '4', '5'] },
      { chapter: generateMockChapter(3), pages: ['1', '2'] },
    ]),
  ).toEqual({
    'https://0': [0, 2],
    'https://1': [4, 7],
    'https://2': [9, 13],
    'https://3': [15, 16],
  });
});

it('correctly determines page boundaries for a chapter with one page only', () => {
  expect(
    determinePageBoundaries([
      { chapter: generateMockChapter(0), pages: ['1'] },
    ]),
  ).toEqual({
    'https://0': [0, 0],
  });
});

it('correctly determines page boundaries for multiple chapters with one page only (common for twitter comics)', () => {
  expect(
    determinePageBoundaries([
      { chapter: generateMockChapter(0), pages: ['1'] },
      { chapter: generateMockChapter(1), pages: ['1'] },
      { chapter: generateMockChapter(2), pages: ['1'] },
      { chapter: generateMockChapter(3), pages: ['1'] },
    ]),
  ).toEqual({
    'https://0': [0, 0],
    'https://1': [2, 2],
    'https://2': [4, 4],
    'https://3': [6, 6],
  });
});

it('correctly determines page boundaries when starting on a non-first chapter', () => {
  expect(
    determinePageBoundaries(
      [{ chapter: generateMockChapter(1), pages: ['1', '2', '3'] }],
      true,
    ),
  ).toEqual({
    'https://1': [1, 3],
  });
});
