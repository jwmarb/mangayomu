export { default } from './MangaSupportedLanguages';
import { ISOLangCode } from '@mangayomu/language-codes';
import { MangaMetaProperty } from '@screens/MangaView/components/MangaViewerHeader/';

export type MangaSupportedLanguagesProps =
  MangaMetaProperty<'availableLanguages'> & {
    hostDefaultLanguage?: ISOLangCode;
  };
