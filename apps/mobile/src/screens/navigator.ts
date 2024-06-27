/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
// This is the root navigator for all screens
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { FetchedMangaResults } from '@/stores/explore';
import { Manga } from '@mangayomu/mangascraper';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Home: undefined;
  MangaView: { manga: unknown; source?: string };
  SourceBrowser: { source: string; genre?: string; initialQuery?: string };
  ExtendedMangaList: { type: keyof FetchedMangaResults };
  Reader: { manga: unknown; source?: string; chapter: unknown };
  ReaderSettings?: { manga: Manga };
  AppearanceSettings: undefined;
};

export type RootStackProps<K extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, K>;

export const RootStack = createNativeStackNavigator<RootStackParamList>();
