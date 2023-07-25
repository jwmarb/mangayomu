import { useUser } from '@app/context/realm';

export type RealmUser = ReturnType<typeof useUser>;

export type RealmObjectSchema = {
  name: string;
};

export default function Collection<TObject extends { _id: string }>(
  schema: RealmObjectSchema,
) {
  return class Collection {
    static schema: RealmObjectSchema = schema;
    readonly collection: Realm.Services.MongoDB.MongoDBCollection<TObject>;
    public constructor(user: RealmUser) {
      this.collection = user
        .mongoClient('mongodb-atlas')
        .db('mangayomu')
        .collection<TObject>(schema.name);
    }
  };
}
