import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaHost } from '@mangayomu/mangascraper';
import { ChapterError } from '@redux/slices/reader';
import React from 'react';
import Realm from 'realm';

export interface ChapterErrorProps extends React.PropsWithChildren {
  error: ChapterError;
}

export interface ChapterErrorContextState {
  availableChapters: (ChapterSchema & Realm.Object<ChapterSchema, never>)[];
  localRealm: Realm;
  source: MangaHost;
  offsetIndex: React.MutableRefObject<
    Record<string, { start: number; end: number }>
  >;
}
