import Collection from '@app/realm/collection';
import { IUserHistorySchema } from '@mangayomu/schemas';
import * as RealmWeb from 'realm-web';

export default class HistorySchema extends Collection<IUserHistorySchema>({
  name: 'UserHistory',
  defaults: {
    _id: () => new RealmWeb.BSON.ObjectID() as unknown as Realm.BSON.ObjectId,
    date: () => Date.now(),
  },
}) {}
