import { useUser } from '@app/context/realm';
import useBoolean from '@app/hooks/useBoolean';
import useMongoClient from '@app/hooks/useMongoClient';
import React from 'react';

export type UpdateOptions = {
  /**
   * Inserts a document if it does not exist
   */
  upsert?: boolean;
};

export default function useObject<
  TSchema extends { _id: string; _realmId: string },
  RealmObject = Partial<TSchema> & {
    initializing: boolean;
    update: (fn: (draft: TSchema) => void, options?: UpdateOptions) => void;
    create: (obj: TSchema) => void;
  },
>(
  MongoDBCollection: Parameters<typeof useMongoClient<TSchema>>[0],
  id?: string,
): RealmObject {
  const collection = useMongoClient(MongoDBCollection);
  const user = useUser();
  const [doc, setDoc] = React.useState<TSchema | null>(null);
  const [draft, setDraft] = React.useState<TSchema | null>(null);
  const [insert, setInsert] = React.useState<TSchema | null>(null);
  const [loading, toggleLoading] = useBoolean(true);
  const shouldUpsert = React.useRef<boolean>(false);

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
        toggleLoading(false);
      }
    }
    init();
    listener();
  }, [collection, id, toggleLoading, user.id]);

  const obj = React.useMemo(() => {
    const object = { ...doc } as unknown as TSchema & {
      initializing: boolean;
      update: (fn: (draft: TSchema) => void) => void;
      insert: (obj: TSchema) => void;
    };
    object.initializing = loading;
    object.update = (fn, options = { upsert: false }) => {
      const { upsert } = options;
      let isModified = true;
      const newObj = {} as TSchema;
      const draft =
        doc != null
          ? { ...doc }
          : ({
              ...collection.initFields(),
              _id: id,
              _realmId: user.id,
            } as TSchema);
      fn(draft);
      for (const key in draft) {
        if (draft[key as keyof TSchema] != object[key as keyof TSchema]) {
          isModified = true;
          newObj[key] = draft[key];
        }
      }

      if (isModified) {
        setDoc(draft);
        shouldUpsert.current = upsert;
        setDraft(newObj);
      }
    };
    object.insert = (obj) => {
      setInsert({ ...collection.initFields(), ...obj });
    };
    return object as RealmObject;
  }, [collection, doc, id, user.id, loading]);

  React.useEffect(() => {
    async function uploadChanges() {
      if (draft != null) {
        await collection.updateOne(
          { _id: id, _realmId: user.id },
          { $set: draft },
          { upsert: shouldUpsert.current },
        );

        shouldUpsert.current = false;
        setDraft(null);
      }
    }
    uploadChanges();
  }, [collection, draft, id, user.id]);

  React.useEffect(() => {
    async function insertToDb() {
      if (insert != null) {
        await collection.insertOne(insert);
        setDoc(insert);
        setInsert(null);
      }
    }
    insertToDb();
  }, [collection, insert]);

  return obj;
}