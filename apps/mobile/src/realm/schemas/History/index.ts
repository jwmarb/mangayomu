import Realm from 'realm';

export interface IUserHistorySchema {
  _id: string;
  _realmId: string;
  manga: string;
  chapter: string;
  date: number;
}

export class UserHistorySchema extends Realm.Object<
  IUserHistorySchema,
  keyof IUserHistorySchema
> {
  _id!: string;
  _realmId!: string;
  manga!: string;
  chapter!: string;
  date!: number;
  static schema: Realm.ObjectSchema = {
    name: 'UserHistory',
    properties: {
      _id: {
        type: 'string',
        default: () => new Realm.BSON.ObjectID().toHexString(),
      },
      _realmId: 'string',
      manga: 'string',
      chapter: 'string',
      date: {
        type: 'int',
        default: () => Date.now(),
      },
    },
    primaryKey: '_id',
  };
}
