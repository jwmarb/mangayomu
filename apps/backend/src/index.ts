import { Manga } from '@mangayomu/mangascraper';
export { default as redis } from './redis';
export { default as realm } from './realm';
export * from './middleware';
export * from './helpers';
export * from './schemas';

export interface UpdatesParams {
  source: string[];
}

export interface SourceError {
  error: string;
  source: string;
}

export type MangaConcurrencyResult = {
  errors: SourceError[];
  mangas: Manga[];
};
