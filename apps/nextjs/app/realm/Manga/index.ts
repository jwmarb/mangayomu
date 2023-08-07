import Collection from '@app/realm/collection';
import { IMangaSchema } from '@mangayomu/schemas';
import * as RealmWeb from 'realm-web';

export default class MangaSchema extends Collection<IMangaSchema>({
  name: 'Manga',
  defaults: {
    _id: () => new RealmWeb.BSON.ObjectID() as unknown as Realm.BSON.ObjectId,
    selectedLanguage: 'Use default language',
    readerDirection: 'Use global setting',
    readerImageScaling: 'Use global setting',
    readerLockOrientation: 'Use global setting',
    readerZoomStartPosition: 'Use global setting',
    inLibrary: false,
    notifyNewChaptersCount: 0,
  },
}) {}
