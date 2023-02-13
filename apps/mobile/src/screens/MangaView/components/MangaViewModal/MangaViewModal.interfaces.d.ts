import { SortChaptersMethod } from '@database/schemas/Manga';
import { LanguageProps } from '@screens/MangaView/components/MangaViewModal/Tabs/Language/Language.interfaces';
import { SortProps } from '@screens/MangaView/components/MangaViewModal/Tabs/Sort/Sort.interfaces';
import React from 'react';

export interface MangaViewModalProps extends SortProps, LanguageProps {}
