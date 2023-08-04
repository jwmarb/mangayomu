import Realm from 'realm';

export interface IUserHistorySchema {
  _id: Realm.BSON.ObjectId;
  _realmId: string;
  manga: string;
  chapter: string;
  date: number;
}

export class UserHistorySchema extends Realm.Object<
  IUserHistorySchema,
  keyof IUserHistorySchema
> {
  _id!: Realm.BSON.ObjectId;
  _realmId!: string;
  manga!: string;
  chapter!: string;
  date!: number;
  static schema: Realm.ObjectSchema = {
    name: 'UserHistory',
    properties: {
      _id: {
        type: 'objectId',
        default: () => new Realm.BSON.ObjectID(),
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
