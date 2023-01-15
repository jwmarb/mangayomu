import { Manga } from '@services/scraper/scraper.interfaces';
import React from 'react';
import { FlatList } from 'react-native';

export interface OverlayProps {
  manga: Manga;
  flatListRef: React.RefObject<FlatList>;
}
