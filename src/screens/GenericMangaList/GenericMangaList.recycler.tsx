import { RowRenderer } from '@utils/RecyclerListView.interfaces';
import { LayoutProvider } from 'recyclerlistview';
import { Dimensions } from 'react-native';
import { MangaItemContainerEven, MangaItemContainerOdd } from '@screens/GenericMangaList/GenericMangaList.base';
import Manga from '@components/Manga';
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
      return (
        <MangaItemContainerEven>
          <Manga {...data} />
        </MangaItemContainerEven>
      );
    case Type.ODD: {
      return (
        <MangaItemContainerOdd>
          <Manga {...data} />
        </MangaItemContainerOdd>
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
