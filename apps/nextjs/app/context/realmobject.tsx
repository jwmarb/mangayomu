'use client';
import React from 'react';
import useMongoClient from '@app/hooks/useMongoClient';
import { Document } from '@app/hooks/useObject';
import { useUser } from '@app/context/realm';

type RealmObject = Record<string, unknown>;

type RealmObjectSubscriptionCallback = (value: RealmObject) => void;

type RealmSubscription = <TSchema extends Document>(
  MongoDBCollection: ReturnType<typeof useMongoClient<TSchema>>,
  find: RealmObject,
  onChange: RealmObjectSubscriptionCallback,
) => Promise<() => void>;

const RealmContext = React.createContext<RealmSubscription | null>(null);

/**
 * Keys are MongoDBCollection names
 * Values are the document IDs
 */
const realmDocumentCollections = new Map<
  string,
  {
    collection: ReturnType<typeof useMongoClient>;
    documents: Set<string>;
  }
>();

const realmSubscriptionObjects = new Map<
  string,
  {
    /**
     * The document itself contained in some collection
     */
    document: RealmObject;
    /**
     * Callback functions listening for changes in the document
     */
    subscriptions: Set<RealmObjectSubscriptionCallback>;
  }
>();

export function useRealmObjectSubscription() {
  const s = React.useContext(RealmContext);
  if (s == null)
    throw Error(
      'Attempted to use RealmObjectContext when component is not a child of it',
    );
  return s;
}

export default function RealmObjectProvider({
  children,
}: React.PropsWithChildren) {
  const [subscriptions, setSubscriptions] = React.useState<Set<string>>(
    new Set(),
  );
  const user = useUser();
  const subscribeToRealmObject: RealmSubscription = React.useCallback(
    async <TSchema extends Document>(
      MongoDBCollection: ReturnType<typeof useMongoClient<TSchema>>,
      find: RealmObject,
      onChange: RealmObjectSubscriptionCallback,
    ) => {
      const findKeys = Object.keys(find);
      const iter = realmSubscriptionObjects.entries();
      let next = iter.next();
      while (!next.done) {
        const [_, { document, subscriptions }] = next.value;
        if (Object.keys(document).length != findKeys.length) {
          next = iter.next();
          continue;
        }
        let neqProp = false;
        for (const propKey of findKeys) {
          if (find[propKey] != document[propKey]) {
            neqProp = true;
            break;
          }
        }
        if (neqProp) {
          next = iter.next();
          continue;
        }
        subscriptions.add(onChange);
        break;
      }
      // Made it to the end, next.value is undefined
      // This must mean that no existing subscription exists and must be created
      if (next.done) {
        const document = await MongoDBCollection.findOne(find);
        if (document == null)
          throw Error(
            `Cannot set a subscription on a value that does not exist:\n${JSON.stringify(
              find,
              null,
              2,
            )}`,
          );
        const id = document._id.toString();
        realmSubscriptionObjects.set(id, {
          document,
          subscriptions: new Set([onChange]),
        });
        setSubscriptions((prev) => {
          // if (prev.has(id))
          //   throw Error('Attempted to add an existing subscription');
          prev.add(id);
          return new Set(prev);
        });
        const subscribedDocuments = realmDocumentCollections.get(
          MongoDBCollection.name,
        );
        if (subscribedDocuments == null)
          realmDocumentCollections.set(MongoDBCollection.name, {
            collection: MongoDBCollection,
            documents: new Set([id]),
          });
        else {
          // if (subscribedDocuments.documents.has(id))
          //   throw Error(
          //     `The document ${id} is already being watched under the ${MongoDBCollection.name} collection`,
          //   );
          subscribedDocuments.documents.add(id);
        }
      }
      return () => {
        console.log('unsubscribed invoked');
        const iter = realmSubscriptionObjects.entries();
        let next = iter.next();
        while (!next.done) {
          const [_, { subscriptions, document }] = next.value;
          if (Object.keys(document).length != findKeys.length) {
            next = iter.next();
            continue;
          }
          let neqProp = false;
          for (const propKey of findKeys) {
            if (find[propKey] != document[propKey]) {
              neqProp = true;
              break;
            }
          }
          if (neqProp) {
            next = iter.next();
            continue;
          }
          subscriptions.delete(onChange);
          break;
        }

        // Cleans up when there are no subscriptions
        if (!next.done) {
          const [documentId, { subscriptions }] = next.value;
          if (subscriptions.size === 0) {
            realmSubscriptionObjects.delete(documentId);
            setSubscriptions((prev) => {
              if (!prev.has(documentId))
                throw Error(
                  'Attempted to remove a subscription that does not exist',
                );
              prev.delete(documentId);
              return new Set(prev);
            });
            const subscribedDocuments = realmDocumentCollections.get(
              MongoDBCollection.name,
            );
            if (subscribedDocuments == null)
              throw Error(
                `The collection ${MongoDBCollection.name} does not exist with any references to listeners, yet this clean up function has been invoked when it should not have been.`,
              );
            subscribedDocuments.documents.delete(documentId);
            if (subscribedDocuments.documents.size === 0)
              realmDocumentCollections.delete(MongoDBCollection.name);
          }
        }
      };
    },
    [],
  );

  React.useEffect(() => {
    (async () => {
      let done = false;
      const iter = realmDocumentCollections.entries();
      let next = iter.next();
      while (!next.done && !done) {
        const [_, { collection }] = next.value;
        for await (const change of collection.watch({
          filter: {
            'fullDocument._realmId': user.id,
          },
        })) {
          if (done) break;
          switch (change.operationType) {
            case 'update': {
              const documentKey = change.documentKey._id.toString();
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const realmObj = realmSubscriptionObjects.get(documentKey);
              if (realmObj == null) continue;
              realmObj.document = change.fullDocument as RealmObject;
              const iter2 = realmObj.subscriptions.values();
              let next2 = iter2.next();
              while (!next2.done && !done) {
                next2.value(realmObj.document);
                next2 = iter2.next();
              }
              break;
            }
          }
        }
        next = iter.next();
      }
      return () => {
        done = true;
      };
    })();
  }, [subscriptions, user.id]);

  return (
    <RealmContext.Provider value={subscribeToRealmObject}>
      {children}
    </RealmContext.Provider>
  );
}
