import { ISOLangCode } from '@mangayomu/language-codes';

export interface LanguageProps {
  selectedLanguage: ISOLangCode | 'Use default language';
  supportedLanguages: ISOLangCode[];
  mangaLink: string;
}
