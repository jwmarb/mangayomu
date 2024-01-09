import { AppState } from '@redux/main';
import { ImageCacheType } from '@redux/slices/settings';
import { PersistMigrate, PersistState } from 'redux-persist';
import { createMigrate } from 'redux-persist';
import type { MigrationConfig } from 'redux-persist/es/createMigrate';

export type PersistedAppState = AppState & {
  _persist: PersistState;
};

declare module 'redux-persist' {
  export function createMigrate(
    migrations: Record<
      PropertyKey,
      (state: PersistedAppState) => PersistedAppState
    >,
    config: MigrationConfig,
  ): PersistMigrate;
}

export const PERSIST_VERSION = 2;

export const migrate: PersistMigrate = createMigrate(
  {
    0: (state) =>
      ({
        ...state,
        settings: {
          ...state.settings,
          performance: {
            imageCache: {
              enabled: true,
              type: ImageCacheType.MEMORY,
            },
          },
        },
      } as PersistedAppState),
    1: (state) =>
      ({
        ...state,
        settings: {
          ...state.settings,
          performance: {
            imageCache: {
              enabled: true,
              type: ImageCacheType.MEMORY,
            },
          },
        },
      } as PersistedAppState),
    2: (state) => ({
      ...state,
      settings: {
        ...state.settings,
        reader: {
          ...state.settings.reader,
          keepDeviceAwake: true,
        },
      },
    }),
  },
  { debug: true },
);
