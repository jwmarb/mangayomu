import { Manga } from '@mangayomu/mangascraper/src';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ExploreState } from '@redux/slices/explore';

export type RootStackParamList = {
  Home: undefined;
  MangaView: Manga;
  Welcome: undefined;
  UnfinishedMangaList: undefined;
  BasicMangaList: {
    stateKey: keyof ExploreState['states'];
  };
  SourceView: {
    source: string;
  };
  InfiniteMangaList: {
    source: string;
    genre?: string;
  };
  Settings: undefined;
  Appearance: undefined;
  Reader: {
    chapter: string; // The key of the chapter
    manga: string; // The key of the manga
  };
  MainSourceSelector: undefined;
  GlobalReaderSettings: undefined;
  Login: undefined;
};

export type RootStackProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
