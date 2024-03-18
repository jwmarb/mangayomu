/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MapDeserializer,
  MapSerializer,
  SetDeserializer,
  SetSerializer,
  createPersistConfig,
  mmkv,
} from '@/utils/persist';

type StoreV0 = {
  a: number;
  incr(): void;
};

type StoreV1 = {
  a: number;
  b: number;
  incra(): void;
  incrb(): void;
};

type StoreV3 = {
  a: number;
  b: number;
  c: number;
  d: number;
  incra(): void;
  incrb(): void;
};

type StoreV4 = {
  a: number;
  b: number;
  c: number;
  dNew: number;
  incra(): void;
  incrb(): void;
};

const CONFIG_KEY = '__testconfig__';

const migrationV0 = jest.fn((a: unknown) => ({ ...(a as StoreV0), b: 0 }));

const migrationV1 = jest.fn((a: unknown) => ({ ...(a as StoreV1), c: 0 }));

const migrationV2 = jest.fn((a: unknown) => ({ ...(a as StoreV1), d: 0 }));

const migrationV3 = jest.fn((a: unknown) => {
  delete (a as Record<string, unknown>).d;
  return { ...(a as StoreV1), dNew: 0 };
});

const configv0 = createPersistConfig<StoreV0>({
  name: CONFIG_KEY,
  version: 0,
});

const configv1 = createPersistConfig<StoreV1>({
  name: CONFIG_KEY,
  migrations: {
    0: migrationV0,
  },
  version: 1,
});

const configv3 = createPersistConfig<StoreV3>({
  name: CONFIG_KEY,
  migrations: {
    0: migrationV0,
    1: migrationV1,
    2: migrationV2,
  },
  version: 3,
});

const configv4 = createPersistConfig<StoreV4>({
  name: CONFIG_KEY,
  migrations: {
    0: migrationV0,
    1: migrationV1,
    2: migrationV2,
    3: migrationV3,
  },
  version: 4,
});

let store: ReturnType<typeof create<StoreV0, [['zustand/persist', StoreV0]]>>;

beforeEach(() => {
  store = create(
    persist<StoreV0>(
      (set, get) => ({
        a: 0,
        incr() {
          set({ a: get().a + 1 });
        },
      }),
      configv0,
    ),
  );
});

test('persists state', () => {
  expect(mmkv.getString(CONFIG_KEY)).not.toBeNull();
  expect(JSON.parse(mmkv.getString(CONFIG_KEY)!)).toEqual({
    state: {
      a: 0,
    },
    version: 0,
  });

  store.getState().incr();
  expect(JSON.parse(mmkv.getString(CONFIG_KEY)!)).toEqual({
    state: {
      a: 1,
    },
    version: 0,
  });

  const storev1 = create(
    persist<StoreV1>(
      (set, get) => ({
        a: 0,
        b: 0,
        incra() {
          set({ a: get().a + 1 });
        },
        incrb() {
          set({ b: get().b + 1 });
        },
      }),
      configv1,
    ),
  );

  expect(migrationV0).toHaveBeenCalled();

  expect(JSON.parse(mmkv.getString(CONFIG_KEY)!)).toEqual({
    state: {
      a: 1,
      b: 0,
    },
    version: 1,
  });

  storev1.getState().incrb();

  expect(JSON.parse(mmkv.getString(CONFIG_KEY)!)).toEqual({
    state: {
      a: 1,
      b: 1,
    },
    version: 1,
  });
});

test('migrations done properly', () => {
  store.getState().incr();
  const storev3 = create(
    persist<StoreV3>(
      (set, get) => ({
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        incra() {
          set({ a: get().a + 1 });
        },
        incrb() {
          set({ b: get().b + 1 });
        },
      }),
      configv3,
    ),
  );

  expect(migrationV0).toHaveBeenCalled();
  expect(migrationV1).toHaveBeenCalled();
  expect(migrationV2).toHaveBeenCalled();

  expect(JSON.parse(mmkv.getString(CONFIG_KEY)!)).toEqual({
    state: {
      a: 1,
      b: 0,
      c: 0,
      d: 0,
    },
    version: 3,
  });

  expect(storev3.getState()).toEqual(
    expect.objectContaining({
      a: 1,
      b: 0,
      c: 0,
      d: 0,
    }),
  );

  const storev4 = create(
    persist<StoreV4>(
      (set, get) => ({
        a: 0,
        b: 0,
        c: 0,
        dNew: 0,
        incra() {
          set({ a: get().a + 1 });
        },
        incrb() {
          set({ b: get().b + 1 });
        },
      }),
      configv4,
    ),
  );

  expect(JSON.parse(mmkv.getString(CONFIG_KEY)!)).toEqual({
    state: {
      a: 1,
      b: 0,
      c: 0,
      dNew: 0,
    },
    version: 4,
  });

  expect(storev4.getState().dNew).toEqual(0);
});

test('deserializes/serializes correctly', async () => {
  type Store = {
    set: Set<string>;
    map: Map<string, number>;
    add(key: string, value: number): void;
  };

  const MockMapDeserializer = jest.fn(MapDeserializer);
  const MockMapSerializer = jest.fn(MapSerializer);
  const MockSetDeserializer = jest.fn(SetDeserializer);
  const MockSetSerializer = jest.fn(SetSerializer);

  const store = create(
    persist<Store>(
      (set, get) => ({
        set: new Set(),
        map: new Map(),
        add(key, value) {
          get().set.add(key);
          get().map.set(key, value);
          set({
            set: new Set(get().set),
            map: new Map(get().map),
          });
        },
      }),
      createPersistConfig({
        name: '__store__',
        deserializers: [MockMapDeserializer, MockSetDeserializer],
        serializers: [MockSetSerializer, MockMapSerializer],
        version: 0,
      }),
    ),
  );

  store.getState().add('hello', 0);
  store.getState().add('world', 0);

  expect(MockMapSerializer).toHaveBeenCalled();
  expect(MockSetSerializer).toHaveBeenCalled();

  expect(store.getState().map.has('hello')).toBeTruthy();
  expect(store.getState().set.has('hello')).toBeTruthy();
  expect(store.getState().map.has('world')).toBeTruthy();
  expect(store.getState().set.has('world')).toBeTruthy();

  expect(JSON.parse(mmkv.getString('__store__')!)).toEqual({
    state: {
      set: {
        _type: 'Set',
        elements: ['hello', 'world'],
      },
      map: {
        _type: 'Map',
        elements: [
          ['hello', 0],
          ['world', 0],
        ],
      },
    },
    version: 0,
  });

  store.getState().map = new Map();
  store.getState().set = new Set();

  expect(store.getState().map.has('hello')).toBeFalsy();
  expect(store.getState().set.has('hello')).toBeFalsy();
  expect(store.getState().map.has('world')).toBeFalsy();
  expect(store.getState().set.has('world')).toBeFalsy();

  await store.persist.rehydrate();

  expect(MockSetDeserializer).toHaveBeenCalled();
  expect(MockMapDeserializer).toHaveBeenCalled();

  expect(store.getState().map.has('hello')).toBeTruthy();
  expect(store.getState().set.has('hello')).toBeTruthy();
  expect(store.getState().map.has('world')).toBeTruthy();
  expect(store.getState().set.has('world')).toBeTruthy();
});
