export interface IUserHistorySchema {
  _id: Realm.BSON.ObjectId;
  _realmId: string;
  manga: string;
  chapter: string;
  date: number;
}

export type RequiredUserHistorySchemaFields = keyof IUserHistorySchema;
