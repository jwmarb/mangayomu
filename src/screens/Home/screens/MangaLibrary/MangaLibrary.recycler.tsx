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

export const LayoutLibraryMangaType = {
  FIRST: 0,
  LAST: 1,
  INBETWEEN: 2,
  DYNAMIC: 3,
};

export const dataProviderFn = (r1: string, r2: string) => r1 === r2;

export const generateNewLayout = (cols: number, fontSize: number, itemCount: number) => {
  const { width } = Dimensions.get('window');
  const spacing = SPACE_MULTIPLIER * 2;
  const containerWidth = calculateCoverWidth(cols) * SPACE_MULTIPLIER + spacing;
  const totalMangasPerRow = width / containerWidth;
  const maxMangasPerRow = Math.floor(totalMangasPerRow);

  return new LayoutProvider(
    (i) => {
      if (
        (itemCount % maxMangasPerRow !== 0 &&
          i + 1 > Math.floor(itemCount / maxMangasPerRow) * maxMangasPerRow &&
          i < itemCount) ||
        itemCount < maxMangasPerRow
      )
        return LayoutLibraryMangaType.DYNAMIC;
      else
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
      if (type === LayoutLibraryMangaType.DYNAMIC) {
        dim.width = Math.floor(width / (itemCount - Math.floor(itemCount / maxMangasPerRow) * maxMangasPerRow));
      } else dim.width = Math.floor(containerWidth + (width / maxMangasPerRow - width / totalMangasPerRow));
      
      switch (store.getState().settings.mangaCover.style) {
        default:
        case MangaCoverStyles.CLASSIC:
          dim.height = calculateCoverHeight(cols) * SPACE_MULTIPLIER + fontSize * 4 + spacing;
          break;
        case MangaCoverStyles.MODERN:
          dim.height = calculateCoverHeight(cols) * SPACE_MULTIPLIER + spacing;
      }
    }
  );
};

export const rowRenderer: any = (
  type: string | number,
  data: string,
  index: number,
  extendedState: MangaReducerState & { width: number; orientation: Orientation; itemCount: number }
) => {
  switch (type) {
    case LayoutLibraryMangaType.DYNAMIC:
      return (
        <MangaInLibrary
          manga={extendedState[data]}
          dynamic
          width={extendedState.width}
          orientation={extendedState.orientation}
          itemCount={extendedState.itemCount}
        />
      );

    case LayoutLibraryMangaType.LAST:
      return (
        <MangaInLibrary
          manga={extendedState[data]}
          last
          width={extendedState.width}
          orientation={extendedState.orientation}itemCount={extendedState.itemCount}
        />
      );
    case LayoutLibraryMangaType.FIRST:
      return (
        <MangaInLibrary
          manga={extendedState[data]}
          first
          width={extendedState.width}
          orientation={extendedState.orientation}itemCount={extendedState.itemCount}
        />
      );

    default:
    case LayoutLibraryMangaType.INBETWEEN:
      return (
        <MangaInLibrary
          manga={extendedState[data]}
          width={extendedState.width}
          orientation={extendedState.orientation}itemCount={extendedState.itemCount}
        />
      );
  }
};
