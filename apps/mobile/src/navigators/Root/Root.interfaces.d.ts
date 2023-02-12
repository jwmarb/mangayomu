import { Manga } from '@mangayomu/mangascraper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExploreState } from '@redux/slices/explore';

export type RootStackParamList = {
  Home: undefined;
  MangaView: Manga;
  Welcome: undefined;
  BasicMangaList: {
    stateKey: keyof ExploreState['states'];
  };
};

export type RootStackProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
