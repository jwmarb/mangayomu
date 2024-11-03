import { MangaSource } from '@mangayomu/mangascraper';
import { MMKV } from 'react-native-mmkv';
import { PersistOptions, createJSONStorage } from 'zustand/middleware';

// An MMKV instance for the whole entire application
export const mmkv = new MMKV();

/**
 * A function that serializes a given value into a format suitable for storage.
 *
 * @description This type defines a function that takes an input value of any type and returns a serialized version
 *              of that value. The serialized value can be a primitive (string, number, boolean) or a record (object).
 *
 * @param value - The input value to be serialized. It can be of any type.
 *
 * @returns The serialized version of the input value. This can be a string, number, boolean, or an object (record).
 */
type Serializer = (
  value: unknown,
) => unknown | string | number | boolean | Record<PropertyKey, unknown>;

/**
 * Represents a function that deserializes a value.
 *
 * This type defines a function that takes an unknown value (typically a string or JSON object)
 * and returns a deserialized form of that value. The exact nature of the deserialization process
 * is left to the implementation of the function, but it should generally convert the input into
 * a more usable format for the application.
 *
 * @typedef {function} Deserializer
 * @param {unknown} value - The value to be deserialized. This can be any type, but it is typically
 *                          a string or JSON object that needs to be converted into a more specific
 *                          and useful form.
 * @returns {unknown} - The deserialized value. The return type is also unknown because the output
 *                      can vary depending on the implementation of the deserializer function.
 */
type Deserializer = (value: unknown) => unknown;

/**
 * A record where each key represents a version number, and the corresponding value is a function that migrates
 * persisted data from that version to the current version.
 *
 * For example, a key of 0 would have a function that migrates any persisted states whose versions are 0 to the current version.
 * The migration functions should handle any necessary transformations or updates to the state to ensure compatibility with the latest version.
 *
 * @property {number} [version] - The version number of the persisted data that needs to be migrated.
 * @property {(persistedState: unknown) => unknown} [migrationFunction] - A function that takes the persisted state as an input and returns the migrated state.
 */
type Migrations = Record<number, (persistedState: unknown) => unknown>;

/**
 * The persist config for a store.
 *
 * @template T - The type of the state being persisted.
 */
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

/**
 * Creates a configuration object for persisting state using Zustand.
 * This function wraps around Zustand's `persist` method and provides additional
 * functionality for handling versioning, migrations, serialization, and deserialization.
 *
 * @pre    The `options` parameter must be provided and should contain at least the `name`
 *         and `version` properties. If migrations are specified, they should be an array
 *         of functions that can handle state transformations from one version to another.
 *         If serializers or deserializers are specified, they should be arrays of functions
 *         that can transform values during storage and retrieval.
 * @post   A `PersistOptions` object is created and returned. This object includes the
 *         provided name and version, a migration function that applies any specified
 *         migrations, and a storage configuration that uses custom serializers and
 *         deserializers if provided.
 * @param  options - An object containing configuration options for persistence:
 *         - `name` (string): The unique name of the persisted state.
 *         - `version` (number): The current version of the persisted state.
 *         - `migrations` (optional, Migrations[]): An array of migration functions
 *           to apply when loading older versions of the state. Each function should take
 *           a persisted state and return an updated state.
 *         - `serializers` (optional, Serializer[]): An array of functions to transform values
 *           during storage. Each function should take a value and return a transformed value.
 *         - `deserializers` (optional, Deserializer[]): An array of functions to transform values
 *           during retrieval. Each function should take a value and return a transformed value.
 *         - `partialize` (optional, (state: T) => Partial<T>): A function that takes the full state
 *           and returns a partial state to be persisted.
 *
 * @returns A `PersistOptions` object that can be used with Zustand's `persist` method to manage
 *          the state's storage and retrieval, including versioning and data transformation.
 */
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

/**
 * Deserializes a JSON object representing a manga source and returns the corresponding manga source instance.
 *
 * This deserializer checks if the input value is a valid representation of a manga source. If it is, it converts
 * the JSON object back to a `MangaSource` instance by using the `_name` property to retrieve the source from the
 * available manga sources. If the input value does not meet the required structure, it returns the original value.
 *
 * @pre    The input value must be an object with the properties `_type`, `_name`, and `_version`.
 *         The `_type` property must be a string equal to 'MangaHost', `_name` must be a non-empty string,
 *         and `_version` must be a string.
 * @post   If the input value is valid, the deserializer returns a `MangaSource` instance corresponding to
 *         the `_name` property. Otherwise, it returns the original input value.
 * @param  value The JSON object or any other value to be deserialized.
 *
 * @returns A `MangaSource` instance if the input value is valid; otherwise, the original input value.
 */
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

/**
 * Serializes a Set object into a JSON-compatible format.
 *
 * This function checks if the input value is an instance of a Set. If it is,
 * it converts the Set into an object with a specific structure that includes
 * the type identifier `_type` and an array of its elements. If the input value
 * is not a Set, it returns the value unchanged.
 *
 * @pre    The input value can be any JavaScript/TypeScript data type, but
 *         if it's a Set, it must contain JSON-serializable elements.
 * @post   If the input is a Set, it will be converted to an object with the
 *         structure `{ _type: 'Set', elements: Array }`. Otherwise, the value
 *         remains unchanged.
 * @param  value - The value to be serialized. This can be any data type,
 *         but if it's a Set, it must contain JSON-serializable elements.
 *
 * @returns If the input is a Set, returns an object with the structure
 *          `{ _type: 'Set', elements: Array }`. Otherwise, returns the
 *          original value unchanged.
 */
export const SetSerializer: Serializer = (value: unknown) => {
  if (value instanceof Set) {
    const typed = { _type: 'Set', elements: [...value] };
    return typed;
  }
  return value;
};

/**
 * Deserializes an object with a specific structure back into a Set.
 *
 * This function checks if the input value has a specific structure that includes
 * the type identifier `_type` and an array of elements. If these conditions are met,
 * it converts the object back into a Set containing those elements. If the input value
 * does not match this structure, it returns the value unchanged.
 *
 * @pre The input value can be any JavaScript/TypeScript data type, but if it is
 * an object with `_type: 'Set'` and `elements` as an array, the elements must be
 * valid for constructing a Set.
 * @post If the input matches the expected structure, it will be converted to a Set.
 * Otherwise, the value remains unchanged.
 * @param value - The value to be deserialized. This can be any data type,
 * but if it is an object with `_type: 'Set'` and `elements`, the elements must
 * be valid for constructing a Set.
 *
 * @returns If the input matches the expected structure, returns a new Set containing
 * the elements from the array. Otherwise, returns the original value unchanged.
 */
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

/**
 * Serializes a Map object to a JSON-compatible format.
 *
 * This function checks if the provided value is an instance of `Map`. If it is,
 * it converts the Map into an object with a `_type` property set to 'Map' and an
 * `elements` array containing the key-value pairs from the Map. If the value is
 * not a Map, it returns the value as-is.
 *
 * @pre    The input value must be a valid JavaScript object or primitive.
 *         If the value is a Map, it should contain key-value pairs that can be
 *         serialized into JSON (e.g., no circular references, functions, etc.).
 * @post   The function returns a serializable representation of the input value.
 *         For Maps, this includes an object with a `_type` property and an
 *         `elements` array containing the Map's key-value pairs.
 *
 * @param  {unknown} value - The value to be serialized. This can be any valid
 *         JavaScript object or primitive.
 *
 * @returns {any} - The serialized representation of the input value. If the
 *         input is a Map, it returns an object with `_type` set to 'Map' and
 *         `elements` containing the key-value pairs. Otherwise, it returns the
 *         input value as-is.
 */
export const MapSerializer: Serializer = (value: unknown) => {
  if (value instanceof Map) {
    const typed = { _type: 'Map', elements: [...value] };
    return typed;
  }
  return value;
};

/**
 * Deserializes a JSON object into a JavaScript `Map` if it matches the expected structure.
 *
 * This deserializer checks if the input value is an object with specific properties that indicate
 * it should be converted into a `Map`. The expected structure includes a `_type` property set to 'Map'
 * and an `elements` property that is an array of key-value pairs. If these conditions are met, the
 * function returns a new `Map` populated with the elements from the input value. Otherwise, it returns
 * the original value unchanged.
 *
 * @pre    The input value must be non-null and of type object.
 *         The object should have a `_type` property set to 'Map' and an `elements` property that is an array.
 * @post   If the conditions are met, a new `Map` is created from the elements in the input value.
 *         If not, the original value is returned unchanged.
 * @param  value        The input value to be deserialized. It can be of any type, but if it is an object
 *                      with the expected structure, it will be converted into a `Map`.
 *
 * @returns A new `Map` populated with the elements from the input value if the conditions are met,
 *          otherwise returns the original value unchanged.
 */
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
