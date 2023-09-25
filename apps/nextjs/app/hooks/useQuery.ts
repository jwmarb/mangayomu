import useMongoClient from '@app/hooks/useMongoClient';
import { useUser } from '@app/context/realm';
import React from 'react';
import useDeepMemo from '@app/hooks/useDeepMemo';
import { Comparator, integrateSortedList } from '@mangayomu/algorithms';

export type MongoDBComparisonOperators =
  | '$eq'
  | '$gt'
  | '$gte'
  | '$lt'
  | '$lte'
  | '$ne';
export type MongoDBComparisonOperatorsArray = '$nin' | '$in';
export type ComparisonQuery<T> = Partial<
  Record<MongoDBComparisonOperators, T> &
    Record<MongoDBComparisonOperatorsArray, T[]>
>;
export type LogicalQuery<T> = Partial<{
  $not: ComparisonQuery<T>;
  $and: ComparisonQuery<T>[];
  $nor: ComparisonQuery<T>[];
  $or: ComparisonQuery<T>[];
}>;

export type MongoQuery<T> = ComparisonQuery<T> | LogicalQuery<T>;

export type ElementQuery = Partial<{
  $exists: boolean;
  $type: string | string[];
}>;

export type MongoDBFilter<T> = {
  [K in keyof T]?: T[K] | ComparisonQuery<T[K]> | LogicalQuery<T[K]>;
};

export type MongoDBSort<T> = {
  [K in keyof T as T[K] extends string | number | boolean ? K : never]?: -1 | 1;
};

export type QueryOptions<T> = {
  filter?: MongoDBFilter<T>;
  sort?: MongoDBSort<T>;
};

export type MiscellaneousOptions<T> = {
  onData?: (dbResult: T[]) => void;
};

function compare<T>(a: T, b: T, order: 1 | -1) {
  if (typeof a === 'number' && typeof b === 'number')
    return order === 1 ? a - b : b - a;
  else if (typeof a === 'boolean' && typeof b === 'boolean')
    return order === 1 ? Number(a) - Number(b) : Number(b) - Number(a);
  else if (typeof a === 'string' && typeof b === 'string')
    return order === 1 ? a.localeCompare(b) : b.localeCompare(a);
  else throw Error(`Illegal comparison of type ${typeof a} with ${typeof b}`);
}

export default function useQuery<
  T extends { _id: string | Realm.BSON.ObjectId },
>(
  MongoDBCollection: Parameters<typeof useMongoClient<T>>[0],
  options: QueryOptions<T> = {},
  miscellaneousOptions: MiscellaneousOptions<T> = {},
) {
  const memoizedFilter = useDeepMemo(() => options.filter, [options.filter]);
  const memoizedSort = useDeepMemo(() => options.sort, [options.sort]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sortComparator: Comparator<T> | null = React.useMemo(() => {
    if (memoizedSort == null) return null;
    return (a: T, b: T) => {
      let c = 0;
      for (const key in memoizedSort) {
        const val = memoizedSort[key];
        if (val != null)
          c = c || compare((a as any)[key], (b as any)[key], val);
      }
      return c;
    };
  }, [memoizedSort]);
  const collection = useMongoClient(MongoDBCollection);
  const user = useUser();
  const [data, setData] = React.useState<T[]>([]);
  React.useEffect(() => {
    async function init() {
      const result = await collection.find(
        {
          _realmId: user.id,
        },
        memoizedSort ? { sort: memoizedSort } : undefined,
      );
      setData(result);
      miscellaneousOptions.onData && miscellaneousOptions.onData(result);
    }
    async function listener() {
      for await (const change of collection.watch({
        filter: {
          'fullDocument._realmId': user.id,
          ...(memoizedFilter
            ? Object.entries(memoizedFilter).reduce((prev, [key, value]) => {
                prev['fullDocument.' + key] = value;
                return prev;
              }, {} as Record<string, unknown>)
            : undefined),
        },
      })) {
        switch (change.operationType) {
          case 'update':
            if (sortComparator == null)
              setData((prev) => {
                const arr: T[] = new Array(prev.length);
                for (let i = 0; i < prev.length; i++) {
                  if (
                    prev[i]._id.toString() !==
                      change.documentKey._id.toString() ||
                    change.fullDocument == null
                  )
                    arr[i] = prev[i];
                  else arr[i] = change.fullDocument;
                }
                return arr;
              });
            else
              setData((prev) => {
                if (change.fullDocument != null) {
                  const copy: T[] = new Array(prev.length);
                  for (let i = 0; i < prev.length; i++) {
                    if (
                      prev[i]._id.toString() !==
                      change.documentKey._id.toString()
                    ) {
                      copy[i] = prev[i];
                    } else {
                      copy[i] = change.fullDocument;
                    }
                  }
                  const { insertionSort } = integrateSortedList(
                    copy,
                    sortComparator,
                  );
                  insertionSort();

                  return copy;
                }
                return prev;
              });
            break;
          case 'insert':
            if (sortComparator == null)
              setData((prev) => {
                const arr: T[] = [...prev];
                arr.push(change.fullDocument);
                return arr;
              });
            else
              setData((prev) => {
                const copy = [...prev];
                integrateSortedList(copy, sortComparator).add(
                  change.fullDocument,
                );
                return copy;
              });
            break;
          case 'delete':
            setData((prev) => {
              return prev.filter((doc) => doc._id !== change.documentKey._id);
            });
            break;
        }
      }
    }
    listener();
    init();
  }, [collection, memoizedFilter, user.id, sortComparator, memoizedSort]);

  return data;
}
