import { RowRenderer } from '@utils/RecyclerListView.interfaces';
import { LayoutProvider } from 'recyclerlistview';
import { Dimensions } from 'react-native';
import {
  MangaItemContainerEven,
  MangaItemContainerOdd,
} from '@screens/Home/screens/GenericMangaList/GenericMangaList.base';
import Manga from '@components/Manga';
import { animate, withAnimatedFadeIn, withAnimatedMounting } from '@utils/Animations';

const { width } = Dimensions.get('window');
enum Type {
  ODD,
  EVEN,
}

export const rowRenderer: RowRenderer = (type, data) => {
  switch (type) {
    default:
      return null;
    case Type.EVEN:
      return animate(
        <MangaItemContainerEven>
          <Manga {...data} />
        </MangaItemContainerEven>,
        withAnimatedMounting
      );
    case Type.ODD: {
      return animate(
        <MangaItemContainerOdd>
          <Manga {...data} />
        </MangaItemContainerOdd>,
        withAnimatedMounting
      );
    }
  }
};

export const layoutProvider = new LayoutProvider(
  (index) => (index % 2 === 1 ? Type.ODD : Type.EVEN),
  (type, dim) => {
    dim.width = width / 2 - 1;
    dim.height = 265;
  }
);
