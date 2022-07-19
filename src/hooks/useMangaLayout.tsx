import { AppState } from '@redux/store';
import {
  generateNewLayout,
  LayoutLibraryMangaType,
  LayoutMangaExtendedState,
} from '@screens/Home/screens/MangaLibrary/MangaLibrary.recycler';
import { MangaInLibrary } from '@screens/Home/screens/MangaLibrary/MangaLibrary.base';
import { Manga } from '@services/scraper/scraper.interfaces';
import { RowRenderer } from '@utils/RecyclerListView.interfaces';
import { useSelector } from 'react-redux';
import { Dimensions, useWindowDimensions } from 'react-native';
import { Orientation } from 'expo-screen-orientation';
import React from 'react';
import { MangaCoverStyles } from '@redux/reducers/settingsReducer/settingsReducer.constants';

const rowRenderer = (type: string | number, data: Manga, i: number, extendedState: LayoutMangaExtendedState) => {
  switch (type) {
    case LayoutLibraryMangaType.DYNAMIC:
      return (
        <MangaInLibrary
          manga={data}
          dynamic
          width={extendedState.width}
          orientation={extendedState.orientation}
          fontSize={extendedState.fontSize}
          cols={extendedState.cols}
          type={extendedState.type}
        />
      );

    case LayoutLibraryMangaType.FIRST:
      return (
        <MangaInLibrary
          manga={data}
          first
          width={extendedState.width}
          orientation={extendedState.orientation}
          fontSize={extendedState.fontSize}
          cols={extendedState.cols}
          type={extendedState.type}
        />
      );

    default:
    case LayoutLibraryMangaType.INBETWEEN:
      return (
        <MangaInLibrary
          manga={data}
          width={extendedState.width}
          orientation={extendedState.orientation}
          fontSize={extendedState.fontSize}
          cols={extendedState.cols}
          type={extendedState.type}
        />
      );
    case LayoutLibraryMangaType.LAST:
      return (
        <MangaInLibrary
          manga={data}
          last
          width={extendedState.width}
          orientation={extendedState.orientation}
          fontSize={extendedState.fontSize}
          cols={extendedState.cols}
          type={extendedState.type}
        />
      );
  }
};

/**
 * Hook to automatically use a manga layout provider
 * @returns Returns the layout for a list of mangas
 */
export default function useMangaLayout() {
  const cols = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  const fontSize = useSelector((state: AppState) => state.settings.mangaCover.fontSize);
  const deviceOrientation = useSelector((state: AppState) => state.settings.deviceOrientation);
  const { width } = useWindowDimensions();
  const type = useSelector((state: AppState) => state.settings.mangaCover.style);
  return {
    layoutProvider: generateNewLayout(cols, fontSize, width),
    rowRenderer,
    extendedState: {
      cols,
      fontSize,
      orientation: deviceOrientation,
      width,
      type,
    } as LayoutMangaExtendedState,
  };
}
