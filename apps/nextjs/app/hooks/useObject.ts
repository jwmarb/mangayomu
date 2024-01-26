import { useUser } from '@app/context/realm';
import useBoolean from '@app/hooks/useBoolean';
import useDeepMemo from '@app/hooks/useDeepMemo';
import useMongoClient from '@app/hooks/useMongoClient';
import React from 'react';

export type UpdateOptions = {
  /**
   * Inserts a document if it does not exist
   */
  upsert?: boolean;
};

export type Document = { _id: string | Realm.BSON.ObjectId; _realmId: string };
export type ObjectSubscription = {
  subscriptions: Set<(newDocument: unknown) => void>;
  document: Document | null;
};
const cache = new Map<string, Document>();

export default function useObject<
  TSchema extends Document,
  RealmObject = Partial<TSchema> & {
    initializing: boolean;
    update: (
      fn: (draft: Omit<TSchema, '_id'>) => void,
      options?: UpdateOptions,
    ) => void;
    insert: (obj: Partial<TSchema>) => void;
  },
>(
  MongoDBCollection: Parameters<typeof useMongoClient<TSchema>>[0],
  _id: string | Partial<TSchema>,
): RealmObject {
  const id = useDeepMemo(() => _id, [_id]);
  const isSameDocument = React.useCallback(
    (x?: TSchema | null) => {
      if (id == null || x == null) return false;
      if (typeof id === 'string') return x._id === id;
      for (const key in id) {
        if (id[key] !== x[key]) return false;
      }

      return true;
    },
    [id],
  );
  const collection = useMongoClient(MongoDBCollection);
  const user = useUser();
  const [doc, setDoc] = React.useState<Omit<TSchema, '_id'> | null | undefined>(
    () => {
      const iter = cache.values();
      let next = iter.next();
      while (!next.done) {
        if (isSameDocument(next.value as TSchema))
          return next.value as unknown as Omit<TSchema, '_id'>;
        next = iter.next();
      }
      return null;
    },
  );
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
            if (isSameDocument(change.fullDocument)) {
              if (change.fullDocument != null)
                cache.set(
                  change.documentKey._id.toString(),
                  change.fullDocument,
                );
              setDoc(change.fullDocument || null);
            }
            break;
        }
      }
    }
    async function init() {
      if (id) {
        let document: TSchema | null;

        if (typeof id === 'string') {
          document = await collection.findOne({
            _id: id,
            _realmId: user.id,
          });
        } else {
          document = await collection.findOne({ ...id, _realmId: user.id });
        }
        if (document != null) {
          const docId = document._id.toString();
          if (!cache.has(docId)) cache.set(document._id.toString(), document);
        }
        setDoc(document);
        toggleLoading(false);
      }
    }
    init();
    listener();
  }, [collection, id, toggleLoading, user.id, isSameDocument]);

  const obj = React.useMemo(() => {
    const object = { ...doc } as unknown as TSchema & {
      initializing: boolean;
      update: (fn: (draft: Omit<TSchema, '_id'>) => void) => void;
      insert: (obj: TSchema) => void;
    };
    object.initializing = loading;
    object.update = (fn, options = { upsert: false }) => {
      const { upsert } = options;
      let isModified = true;
      const newObj = {} as TSchema;
      const draft = (
        doc != null
          ? { ...doc }
          : {
              _realmId: user.id,
              ...collection.initFields(),
            }
      ) as Omit<TSchema, '_id'> & { _id?: unknown };

      delete draft['_id'];
      fn(draft);
      for (const key in draft) {
        if (
          draft[key as keyof Omit<TSchema, '_id'>] !=
          object[key as keyof Omit<TSchema, '_id'>]
        ) {
          isModified = true;
          (newObj as any)[key] = (draft as any)[key];
        }
      }

      if (isModified) {
        setDoc(draft);
        shouldUpsert.current = upsert;
        setDraft(newObj);
      }
    };
    object.insert = (obj) => {
      setInsert({ ...collection.initFields(), ...obj, _realmId: user.id });
    };
    return object as RealmObject;
  }, [collection, doc, user.id, loading]);

  React.useEffect(() => {
    async function uploadChanges() {
      if (draft != null && id != null) {
        await collection.updateOne(
          typeof id === 'string'
            ? { _id: id, _realmId: user.id }
            : { ...id, _realmId: user.id },
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
