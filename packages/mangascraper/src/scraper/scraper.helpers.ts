import {
  AbstractFilters,
  MutableAbstractFilter,
  MutableInclusiveExclusiveFilter,
  MutableOptionFilter,
  MutableSortFilter,
} from '@mangayomu/schema-creator';
import { MangaChapter } from './scraper.interfaces';

export function toPascalCase(input: string) {
  return input
    .trim()
    .split(/\s|-|_/g)
    .map((x) => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase())
    .join(' ')
    .trim();
}

export function sortChapters(x: MangaChapter[]) {
  x.sort((a, b) => {
    if (
      'language' in a &&
      'language' in b &&
      typeof a.language === 'string' &&
      typeof b.language === 'string'
    ) {
      if (a.language === b.language) return a.index - b.index;
      return a.language.localeCompare(b.language);
    }
    return a.index - b.index;
  });
  for (let i = 0; i < x.length; i++) {
    x[i].index = i;
  }
}

// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
export function hashCode(x: string) {
  let hash = 7,
    chr = 0;
  for (let i = 0, n = x.length; i < n; i++) {
    chr = x.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export function isFiltersEqual(
  x: MutableAbstractFilter,
  y: MutableAbstractFilter,
) {
  if (Object.keys(x).length !== Object.keys(y).length) {
    return false;
  }

  for (const key in x) {
    if (key in y === false) {
      return false;
    }
    const valueX = x[key];
    const valueY = y[key];
    if (valueX.type !== valueY.type) return false;
    switch (valueX.type) {
      case 'inclusive/exclusive': {
        const typedValueY = valueY as MutableInclusiveExclusiveFilter<string>;
        if (
          valueX.exclude.length !== typedValueY.exclude.length ||
          valueX.include.length !== typedValueY.include.length
        )
          return false;
        if (
          new Set([...valueX.exclude, ...typedValueY.exclude]).size !==
          valueX.exclude.length
        )
          return false;
        if (
          new Set([...valueX.include, ...typedValueY.include]).size !==
          valueX.include.length
        )
          return false;
        break;
      }
      case 'option': {
        const typedValueY = valueY as MutableOptionFilter<string>;
        if (valueX.value !== typedValueY.value) return false;
        break;
      }
      case 'sort': {
        const typedValueY = valueY as MutableSortFilter<string>;
        if (valueX.value !== typedValueY.value) return false;
        break;
      }
    }
  }
  return true;
}

export function hashFilter(x: MutableAbstractFilter) {
  let hash = 31;
  for (const key in x) {
    const value = x[key];

    switch (value.type) {
      case 'inclusive/exclusive':
        hash =
          (hash +
            value.include.reduce(
              (prev, curr) => (prev ^ hashCode(curr)) >> 3,
              35,
            )) |
          0;
        hash =
          (hash +
            value.exclude.reduce(
              (prev, curr) => (prev ^ hashCode(curr)) >> 3,
              35,
            )) |
          0;
        continue;
      case 'option':
      case 'sort':
        hash = (hash + hashCode(value.value)) >> 3;
        continue;
    }
  }
  return hash;
}

export function generateHash(
  query: string,
  filters: MutableAbstractFilter = {},
) {
  return hashCode(query) + hashFilter(filters);
}
