import Realm from 'realm';
import { createRealmContext } from '@realm/react';
import {
  MangaRatingSchema,
  MangaReadingChapter,
  MangaSchema,
  MangaStatusSchema,
} from '@database/schemas/Manga';
import { ChapterSchema } from '@database/schemas/Chapter';
import { AppState } from '@redux/main';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
export * from './providers/UserProvider';
// export * from './providers/RealmProvider';
export const { useObject, useQuery, useRealm, RealmProvider } =
  createRealmContext({
    schema: [
      MangaSchema,
      MangaRatingSchema,
      MangaStatusSchema,
      MangaReadingChapter,
    ],
    schemaVersion: 36,
  });

export const {
  RealmProvider: LocalRealmProvider,
  useObject: useLocalObject,
  useQuery: useLocalQuery,
  useRealm: useLocalRealm,
} = createRealmContext({
  schema: [ChapterSchema],
  schemaVersion: 1,
  path: Realm.defaultPath.replace('default.realm', 'local.realm'),
});
