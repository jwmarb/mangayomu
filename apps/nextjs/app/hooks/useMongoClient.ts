import { useUser } from '@app/context/realm';
import {
  RealmObjectSchema,
  RealmObjectSchemaPropertyInitializer,
  RealmUser,
} from '@app/realm/collection';
import React from 'react';

type TCollection<T extends { _id: string | Realm.BSON.ObjectId }> =
  Realm.Services.MongoDB.MongoDBCollection<T>;

interface MongoDBCollection<T extends { _id: string | Realm.BSON.ObjectId }>
  extends TCollection<T> {
  /**
   * Initializes fields for the purpose of creating a document
   * @returns Returns properties of a document with values initialized
   */
  initFields: () => Partial<T>;
  /**
   * The name of the collection
   */
  name: string;
}

export default function useMongoClient<
  TSchema extends { _id: string | Realm.BSON.ObjectId },
>(
  MongoDBCollection: (new (user: RealmUser) => {
    readonly collection: TCollection<TSchema>;
    readonly name: string;
  }) & {
    type: '_realmObjectSchema';
  },
): MongoDBCollection<TSchema> {
  const user = useUser();
  const collection = React.useMemo(() => {
    const val = new MongoDBCollection(user);
    const collection = val.collection as MongoDBCollection<TSchema>;
    collection.name = val.name;
    collection.initFields = () => {
      const obj: Partial<TSchema> = {};
      for (const key in (
        MongoDBCollection as typeof MongoDBCollection & {
          schema: RealmObjectSchema<TSchema>;
        }
      ).schema.defaults) {
        const value = (
          (
            MongoDBCollection as typeof MongoDBCollection & {
              schema: RealmObjectSchema<TSchema>;
            }
          ).schema.defaults as RealmObjectSchemaPropertyInitializer<TSchema>
        )[key as keyof TSchema];
        switch (typeof value) {
          case 'function':
            obj[key] = value();
            break;
          default:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            obj[key] = value as unknown as any;
        }
      }
      return obj;
    };
    return collection;
  }, [MongoDBCollection, user]);
  return collection;
}
