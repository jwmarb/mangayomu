import Collection from '@app/realm/collection';
import { IChapterSchema } from '@mangayomu/schemas';
import * as RealmWeb from 'realm-web';

export default class ChapterSchema extends Collection<IChapterSchema>({
  name: 'Chapter',
  defaults: {
    _id: () => new RealmWeb.BSON.ObjectID() as unknown as Realm.BSON.ObjectId,
    dateRead: () => Date.now(),
    indexPage: 0,
    scrollPosition: 0,
    savedScrollPositionType: 'landscape',
  },
}) {}
