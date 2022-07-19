import { Container } from '@components/Container';
import Manga from '@components/Manga';
import { calculateCoverWidth, calculateCoverHeight } from '@components/Manga/Cover/Cover.helpers';
import { MangaReducerState } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { MangaCoverStyles } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import store from '@redux/store';
import { MangaInLibrary } from '@screens/Home/screens/MangaLibrary/MangaLibrary.base';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { RowRenderer } from '@utils/RecyclerListView.interfaces';
import { Orientation } from 'expo-screen-orientation';
import { Dimensions } from 'react-native';
import { LayoutProvider } from 'recyclerlistview';

export type LayoutMangaExtendedState = {
  width: number;
  orientation: Orientation;
  cols: number;
  fontSize: number;
  type: MangaCoverStyles;
};

export const LayoutLibraryMangaType = {
  FIRST: 0,
  LAST: 1,
  INBETWEEN: 2,
  DYNAMIC: 3,
};

export const dataProviderFn = (r1: string, r2: string) => r1 === r2;

export const generateNewLayout = (cols: number, fontSize: number, width: number) => {
  const spacing = SPACE_MULTIPLIER * 2;
  const containerWidth = calculateCoverWidth(cols) * SPACE_MULTIPLIER + spacing;
  const totalMangasPerRow = width / containerWidth;
  const maxMangasPerRow = Math.floor(totalMangasPerRow);
  const test = width / maxMangasPerRow - width / totalMangasPerRow;

  return new LayoutProvider(
    (i) => {
      switch (i % maxMangasPerRow) {
        case 0:
          return LayoutLibraryMangaType.FIRST;
        case maxMangasPerRow - 1:
          return LayoutLibraryMangaType.LAST;
        default:
          return LayoutLibraryMangaType.INBETWEEN;
      }
    },
    (type, dim) => {
      dim.width = containerWidth + test;

      switch (store.getState().settings.mangaCover.style) {
        default:
        case MangaCoverStyles.CLASSIC:
          dim.height = calculateCoverHeight(cols) * SPACE_MULTIPLIER + fontSize * 4 + spacing;
          break;
        case MangaCoverStyles.MODERN:
          dim.height = calculateCoverHeight(cols) * SPACE_MULTIPLIER + spacing;
          break;
      }
    }
  );
};

export const rowRenderer: any = (
  type: string | number,
  data: string,
  index: number,
  extendedState: MangaReducerState & LayoutMangaExtendedState
) => {
  switch (type) {
    case LayoutLibraryMangaType.DYNAMIC:
      return (
        <MangaInLibrary
          manga={extendedState[data]}
          dynamic
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
          manga={extendedState[data]}
          last
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
          manga={extendedState[data]}
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
          manga={extendedState[data]}
          width={extendedState.width}
          orientation={extendedState.orientation}
          fontSize={extendedState.fontSize}
          cols={extendedState.cols}
          type={extendedState.type}
        />
      );
  }
};
