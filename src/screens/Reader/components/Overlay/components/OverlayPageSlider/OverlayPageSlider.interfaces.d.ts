import React from 'react';
import { FlatList } from 'react-native';

export interface OverlayPageSliderProps {
  flatListRef: React.RefObject<FlatList>;
  page: number;
  totalPages: number;
  offset: number;
}
