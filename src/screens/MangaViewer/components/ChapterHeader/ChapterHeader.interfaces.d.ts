import { MangaChapter } from '@services/scraper/scraper.interfaces';
import { ISOLangCode } from '@utils/languageCodes';
import React from 'react';

export interface ChapterHeaderProps {
  chapters?: MangaChapter[];
  sort: string;
  loading: boolean;
  refresh: () => Promise<void>;
  handleOnOpenModal: () => void;
  language: ISOLangCode;
  onChangeLanguage: (lang: ISOLangCode) => void;
  onSelectAll: (newVal: boolean) => void;
}
