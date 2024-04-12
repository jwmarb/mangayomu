import { MangaSource } from '@mangayomu/mangascraper';
import { MMKV } from 'react-native-mmkv';
import { PersistOptions, createJSONStorage } from 'zustand/middleware';

export const mmkv = new MMKV();

type Serializer = (
  value: unknown,
) => unknown | string | number | boolean | Record<PropertyKey, unknown>;

/**
 *
 */
type Deserializer = (value: unknown) => unknown;

/**
 * A number record whose values are functions that allow for data migration to the current version.
 *
 * A key of 0 would have a function that migrates any persisted states whose versions are 0 to the current version
 */
type Migrations = Record<number, (persistedState: unknown) => unknown>;

type PersistConfigOptions<T> = {
  serializers?: Serializer[];
  deserializers?: Deserializer[];
  migrations?: Migrations;
  partialize?: (state: T) => Partial<T>;
  version: number;
  name: string;
};

const storage = {
  getItem(name: string) {
    return mmkv.getString(name) ?? null;
  },
  setItem(name: string, value: string) {
    mmkv.set(name, value);
  },
  removeItem(name: string) {
    mmkv.delete(name);
  },
};

export function createPersistConfig<T>(
  options: PersistConfigOptions<T>,
): PersistOptions<T> {
  return {
    name: options.name,
    version: options.version,
    migrate(persistedState, version) {
      if (options.migrations == null) return persistedState;
      for (let i = version; i < options.version; i++) {
        persistedState = options.migrations[i](persistedState);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return persistedState as any;
    },
    storage: createJSONStorage(() => storage, {
      reviver(key, value) {
        if (options.deserializers != null)
          for (let i = 0; i < options.deserializers.length; i++) {
            value = options.deserializers[i](value);
          }
        return value;
      },
      replacer(key, value) {
        if (options.serializers != null)
          for (let i = 0; i < options.serializers.length; i++) {
            value = options.serializers[i](value);
          }
        return value;
      },
    }),
  };
}

// All available serializers/deserializers

export const MangaSourceDeserializer: Deserializer = (value: unknown) => {
  if (
    value != null &&
    typeof value === 'object' &&
    '_type' in value &&
    value._type === 'MangaHost' &&
    '_name' in value &&
    typeof value._name === 'string' &&
    '_version' in value &&
    typeof value._version === 'string'
  ) {
    const typed = value as ReturnType<MangaSource['toJSON']>;
    return MangaSource.getSource(typed._name);
  }
  return value;
};

export const SetSerializer: Serializer = (value: unknown) => {
  if (value instanceof Set) {
    const typed = { _type: 'Set', elements: [...value] };
    return typed;
  }
  return value;
};

export const SetDeserializer: Deserializer = (value: unknown) => {
  if (
    value != null &&
    typeof value === 'object' &&
    '_type' in value &&
    value._type === 'Set' &&
    'elements' in value &&
    Array.isArray(value.elements)
  ) {
    return new Set(value.elements);
  }
  return value;
};

export const MapSerializer: Serializer = (value: unknown) => {
  if (value instanceof Map) {
    const typed = { _type: 'Map', elements: [...value] };
    return typed;
  }
  return value;
};

export const MapDeserializer: Deserializer = (value: unknown) => {
  if (
    value != null &&
    typeof value === 'object' &&
    '_type' in value &&
    value._type === 'Map' &&
    'elements' in value &&
    Array.isArray(value.elements)
  ) {
    return new Map(value.elements);
  }
  return value;
};
