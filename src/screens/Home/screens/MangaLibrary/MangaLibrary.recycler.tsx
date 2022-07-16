import { Container } from '@components/Container';
import Manga from '@components/Manga';
import { calculateCoverWidth, calculateCoverHeight } from '@components/Manga/Cover/Cover.helpers';
import { MangaReducerState } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { MangaCoverStyles } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import store from '@redux/store';
import { MangaInLibrary } from '@screens/Home/screens/MangaLibrary/MangaLibrary.base';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { RowRenderer } from '@utils/RecyclerListView.interfaces';
import { Dimensions } from 'react-native';
import { LayoutProvider } from 'recyclerlistview';
const { width } = Dimensions.get('window');

export const LayoutLibraryMangaType = {
  FIRST: 0,
  LAST: 1,
  INBETWEEN: 2,
  DYNAMIC: 3,
};

export const dataProviderFn = (r1: string, r2: string) => r1 === r2;

export const generateNewLayout = (cols: number, fontSize: number, itemCount: number) => {
  const spacing = SPACE_MULTIPLIER * 2;
  const containerWidth = calculateCoverWidth(cols) * SPACE_MULTIPLIER + spacing;
  const totalMangasPerRow = width / containerWidth;
  const maxMangasPerRow = Math.floor(totalMangasPerRow);
  const isUnevenLayout = itemCount < maxMangasPerRow;
  console.log();
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
        dim.width = width / (itemCount - Math.floor(itemCount / maxMangasPerRow) * maxMangasPerRow);
      } else dim.width = Math.round(containerWidth + (width / maxMangasPerRow - width / totalMangasPerRow));

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
  extendedState: MangaReducerState
) => {
  switch (type) {
    case LayoutLibraryMangaType.DYNAMIC:
      return <MangaInLibrary manga={extendedState[data]} dynamic />;

    case LayoutLibraryMangaType.LAST:
      return <MangaInLibrary manga={extendedState[data]} last />;
    case LayoutLibraryMangaType.FIRST:
      return <MangaInLibrary manga={extendedState[data]} first />;

    default:
    case LayoutLibraryMangaType.INBETWEEN:
      return <MangaInLibrary manga={extendedState[data]} />;
  }
};
