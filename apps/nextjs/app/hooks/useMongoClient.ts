import { useUser } from '@app/context/realm';
import { RealmUser } from '@app/realm/collection';
import React from 'react';

export default function useMongoClient<T>(
  MongoDBCollection: new (user: RealmUser) => {
    collection: T;
  },
) {
  const user = useUser();
  const collection = React.useMemo(
    () => new MongoDBCollection(user).collection,
    [MongoDBCollection, user],
  );
  return collection;
}
