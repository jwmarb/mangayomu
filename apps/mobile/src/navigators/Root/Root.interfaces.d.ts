import { Manga } from '@mangayomu/mangascraper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExploreState } from '@redux/slices/explore';

export type RootStackParamList = {
  Home: undefined;
  MangaView: Omit<Manga, 'index'>;
  Welcome: undefined;
  BasicMangaList: {
    stateKey: keyof ExploreState['states'];
  };
  SourceView: {
    source: string;
  };
};

export type RootStackProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
