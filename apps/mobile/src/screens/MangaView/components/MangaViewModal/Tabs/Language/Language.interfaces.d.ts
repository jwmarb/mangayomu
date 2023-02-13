import { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';

export interface LanguageProps {
  selectedLanguage: ISOLangCode | 'Use default language';
  supportedLanguages: ISOLangCode[];
  mangaLink: string;
}
