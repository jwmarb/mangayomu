import { useUser } from '@app/context/realm';
import useMongoClient from '@app/hooks/useMongoClient';
import MangaSchema from '@app/realm/Manga';
import { RealmUser } from '@app/realm/collection';
import React from 'react';

export default function useObject<
  TSchema extends { _id: string },
  TCollection extends Realm.Services.MongoDB.MongoDBCollection<TSchema> = Realm.Services.MongoDB.MongoDBCollection<TSchema>,
  RealmObject = TSchema & {
    update: (fn: (draft: TSchema) => void) => void;
  },
>(
  MongoDBCollection: new (user: RealmUser) => {
    collection: TCollection;
  },
  id?: string,
): RealmObject | null {
  const collection = useMongoClient<TCollection>(MongoDBCollection);
  const user = useUser();
  const [doc, setDoc] = React.useState<TSchema | null>(null);
  const [draft, setDraft] = React.useState<TSchema | null>(null);

  React.useEffect(() => {
    async function listener() {
      for await (const change of collection.watch({
        filter: { 'fullDocument._realmId': user.id },
      })) {
        switch (change.operationType) {
          case 'insert':
          case 'update':
            if (change.documentKey._id === id)
              setDoc(change.fullDocument || null);
            break;
        }
      }
    }
    async function init() {
      if (id) {
        const document = await collection.findOne({
          _id: id,
          _realmId: user.id,
        });
        setDoc(document);
      }
    }
    init();
    listener();
  }, [collection, id, user.id]);

  const obj = React.useMemo(() => {
    if (doc != null) {
      const object = { ...doc } as TSchema & {
        update: (fn: (draft: TSchema) => void) => void;
      };
      object.update = (fn) => {
        let isModified = true;
        const newObj = {} as TSchema;
        const draft = { ...doc };
        fn(draft);
        for (const key in draft) {
          if (draft[key as keyof TSchema] != object[key as keyof TSchema]) {
            isModified = true;
            newObj[key] = draft[key];
          }
        }

        if (isModified) {
          console.log('Changes have been set');
          setDoc(draft);
          setDraft(newObj);
        }
      };
      return object as RealmObject;
    }

    return null;
  }, [doc]);

  React.useEffect(() => {
    async function uploadChanges() {
      if (draft != null) {
        console.log('Uploading changes...');
        console.log(draft);
        await collection.updateOne(
          { _id: id, _realmId: user.id },
          { $set: draft },
        );
        console.log(
          'Changes have been fully uploaded to DB and doc has been rehydrated',
        );
        setDraft(null);
      }
    }
    uploadChanges();
  }, [collection, draft, id, user.id]);

  return obj;
}
