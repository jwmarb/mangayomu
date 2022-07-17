import { AppState } from '@redux/store';
import { generateNewLayout, LayoutLibraryMangaType } from '@screens/Home/screens/MangaLibrary/MangaLibrary.recycler';
import { MangaInLibrary } from '@screens/Home/screens/MangaLibrary/MangaLibrary.base';
import { Manga } from '@services/scraper/scraper.interfaces';
import { RowRenderer } from '@utils/RecyclerListView.interfaces';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { Orientation } from 'expo-screen-orientation';
import React from 'react';

const rowRenderer = (
  type: string | number,
  data: Manga,
  i: number,
  extendedState: { width: number; orientation: Orientation; itemCount: number }
) => {
  switch (type) {
    case LayoutLibraryMangaType.DYNAMIC:
      return (
        <MangaInLibrary
          manga={data}
          dynamic
          width={extendedState.width}
          orientation={extendedState.orientation}
          itemCount={extendedState.itemCount}
        />
      );

    case LayoutLibraryMangaType.FIRST:
      return (
        <MangaInLibrary
          manga={data}
          first
          width={extendedState.width}
          orientation={extendedState.orientation}
          itemCount={extendedState.itemCount}
        />
      );

    default:
    case LayoutLibraryMangaType.INBETWEEN:
      return (
        <MangaInLibrary
          manga={data}
          width={extendedState.width}
          orientation={extendedState.orientation}
          itemCount={extendedState.itemCount}
        />
      );
    case LayoutLibraryMangaType.LAST:
      return (
        <MangaInLibrary
          manga={data}
          last
          width={extendedState.width}
          orientation={extendedState.orientation}
          itemCount={extendedState.itemCount}
        />
      );
  }
};

/**
 * Hook to automatically use a manga layout provider
 * @returns Returns the layout for a list of mangas
 */
export default function useMangaLayout(items: any[]) {
  const cols = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  const fontSize = useSelector((state: AppState) => state.settings.mangaCover.fontSize);
  const deviceOrientation = useSelector((state: AppState) => state.settings.deviceOrientation);
  return {
    layoutProvider: React.useMemo(
      () => generateNewLayout(cols, fontSize, items.length),
      [cols, fontSize, items.length, deviceOrientation]
    ),
    rowRenderer,
  };
}
