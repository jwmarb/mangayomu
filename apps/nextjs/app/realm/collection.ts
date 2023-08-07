import { useUser } from '@app/context/realm';

export type RealmUser = ReturnType<typeof useUser>;

export type RealmObjectSchemaPropertyInitializer<T> = {
  [K in keyof T]?: T[K] | (() => T[K]);
};

export type RealmObjectSchema<T> = {
  name: string;
  defaults?: RealmObjectSchemaPropertyInitializer<T>;
};
export default function Collection<
  TObject extends { _id: string | Realm.BSON.ObjectId },
>(schema: RealmObjectSchema<TObject>) {
  return class Collection {
    static schema: RealmObjectSchema<TObject> = schema;
    readonly collection: Realm.Services.MongoDB.MongoDBCollection<TObject>;
    public constructor(user: RealmUser) {
      this.collection = user
        .mongoClient('mongodb-atlas')
        .db('mangayomu')
        .collection<TObject>(schema.name);
    }
  };
}
