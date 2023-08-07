import Collection from '@app/realm/collection';
import { IMangaSchema } from '@mangayomu/schemas';

export default class MangaSchema extends Collection<IMangaSchema>({
  name: 'Manga',
  defaults: {
    _id: () => new Realm.BSON.ObjectID(),
    selectedLanguage: 'Use default language',
    readerDirection: 'Use global setting',
    readerImageScaling: 'Use global setting',
    readerLockOrientation: 'Use global setting',
    readerZoomStartPosition: 'Use global setting',
    inLibrary: false,
    notifyNewChaptersCount: 0,
  },
}) {}
