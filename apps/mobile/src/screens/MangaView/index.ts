import { CHAPTER_SORT_OPTIONS } from '@/models/schema';

export { default } from './MangaView';

// The # of chapters to first show. This value increases by a power of 2 per pagination.
export const INITIAL_CHAPTERS_BATCH = 8;

export const BITWISE_AMOUNT = Math.ceil(Math.log2(CHAPTER_SORT_OPTIONS.length));

// # of times to shift the bit. This is for hashing the `ChapterSortOption` enum
export const HASH_BIT_SHIFT = 1 << BITWISE_AMOUNT;
