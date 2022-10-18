import {
  Screen,
  Container,
  Typography,
  IconButton,
  Icon,
  Spacer,
  TextField,
  Flex,
  Modal,
  Tabs,
  Tab,
  ListItem,
  List,
  Button,
  Progress,
} from '@components/core';
import { FlashList } from '@shopify/flash-list';
import { FlatListScreen } from '@components/core';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { HeaderBuilder, MangaSource } from '@components/Screen/Header/Header.base';
import { TextFieldProps } from '@components/TextField/TextField.interfaces';
import useLazyLoading from '@hooks/useLazyLoading';
import useMountedEffect from '@hooks/useMountedEffect';
import useSearchBar from '@hooks/useSearchBar';
import useSort from '@hooks/useSort';
import useStatefulHeader from '@hooks/useStatefulHeader';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { ReadingMangaInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import FilterModal from '@screens/Home/screens/MangaLibrary/components/FilterModal';
import Search from '@screens/Home/screens/MangaLibrary/components/Search';
import { ExpandedSortContainer } from '@screens/Home/screens/MangaLibrary/MangaLibrary.base';
import {
  ReverseContext,
  SetReverseContext,
  SetSortContext,
  SortContext,
} from '@screens/Home/screens/MangaLibrary/MangaLibrary.context';
import {
  dataProviderFn,
  generateNewLayout,
  rowRenderer,
} from '@screens/Home/screens/MangaLibrary/components/MangaLibraryRLV/MangaLibraryRLV.recycler';
import connector, { MangaLibraryProps } from '@screens/Home/screens/MangaLibrary/MangaLibrary.redux';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { titleIncludes } from '@utils/MangaFilters';
import pixelToNumber from '@utils/pixelToNumber';
import React, { useLayoutEffect } from 'react';
import { FlatList, Keyboard, RefreshControl, useWindowDimensions } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { useTheme } from 'styled-components/native';
import LibraryIsEmpty from '../../components/LibraryIsEmpty';
import NoItemsFound from '../../components/NoItemsFound';
import PropTypes from 'prop-types';
import { renderItem, keyExtractor } from './MangaLibraryFlatList.flatlist';
import { Orientation } from 'expo-screen-orientation';
import displayMessage from '@utils/displayMessage';
import MangaHost from '@services/scraper/scraper.abstract';
import pLimit from 'p-limit';
import SortedList from '@utils/SortedList';
import insertionSort from '@utils/Algorithms/insertionSort';
import { MangaItemsLoading } from '@screens/GenericMangaList/GenericMangaList.base';
const limit = pLimit(1);
const personalLibrary = [
  'https://mangapark.net/comic/116916/oneesan-ga-shinryakuchuu',
  'https://mangapark.net/comic/121557/she-looks-especially-cute-to-me',
  'https://mangapark.net/comic/220197/i-don-t-understand-shirogane-san-s-facial-expression-at-all',
  'https://mangapark.net/comic/225724/hiiragi-san-is-a-little-careless',
  'https://mangapark.net/comic/226126/the-apothecary-will-make-this-battered-elf-happy',
  'https://mangapark.net/comic/253389/ore-no-kokan-wa-bishoujo-datta-no-ka',
  'https://mangapark.net/comic/253403/ore-no-kokan-wa-bishoujo-datta-no-ka',
  'https://mangapark.net/comic/74759/welcome-to-the-maneater-dungeon-the-comic',
  'https://mangapark.net/comic/76490/bunretsu-lover',
  'https://mangasee123.com/manga/25-Dimensional-Seduction',
  'https://mangasee123.com/manga/Adamasu-no-Majotachi',
  'https://mangasee123.com/manga/Ano-Oni-Kyoushi-ga-Boku-no-Ane-ni-Narundesuka',
  'https://mangasee123.com/manga/Asoko-de-Hataraku-Musubu-san',
  'https://mangasee123.com/manga/Atsumare-Fushigi-Kenkyu-bu',
  'https://mangasee123.com/manga/Berserk',
  'https://mangasee123.com/manga/Binetsu-Kuukan',
  'https://mangasee123.com/manga/Bocchi-Na-Bokura-No-Renai-Jijou',
  'https://mangasee123.com/manga/Boku-no-Kokoro-no-Yabai-Yatsu',
  'https://mangasee123.com/manga/Chitose-Is-in-the-Ramune-Bottle',
  'https://mangasee123.com/manga/Danshi-Koukousei-wo-Yashinaitai-Onee-san-no-Hanashi',
  'https://mangasee123.com/manga/Did-You-Think-You-Could-Run-After-Reincarnating-Nii-san',
  'https://mangasee123.com/manga/Erotic-x-Anabolic',
  'https://mangasee123.com/manga/Futoku-No-Guild',
  'https://mangasee123.com/manga/Fuufu-Ijou-Koibito-Miman',
  'https://mangasee123.com/manga/Getsuyoubi-no-Tawawa',
  'https://mangasee123.com/manga/Gyaru-Sen',
  'https://mangasee123.com/manga/Hajirau-Kimi-ga-Mitainda',
  'https://mangasee123.com/manga/Hanging-Out-with-a-Gamer-Girl',
  'https://mangasee123.com/manga/Hirasaka-Hinako-ga-Ero-Kawaii-koto-wo-Ore-dake-ga-Shitteiru',
  'https://mangasee123.com/manga/Houkago-no-Goumon-Shoujo',
  'https://mangasee123.com/manga/Ice-Cream-Kanojo',
  'https://mangasee123.com/manga/Ijiranaide-Nagatoro-san',
  'https://mangasee123.com/manga/Is-this-Hero-for-Real',
  'https://mangasee123.com/manga/Isekai-NTR-Shinyuu-no-Onna-wo-Saikyou-Skill-de-Otosu-Houhou',
  'https://mangasee123.com/manga/Isekai-Ojisan',
  'https://mangasee123.com/manga/Kaguya-Wants-To-Be-Confessed-To',
  'https://mangasee123.com/manga/Kanojo-Okarishimasu',
  'https://mangasee123.com/manga/Kekkon-Surutte-Hontou-desu-ka-365-Days-to-the-Wedding',
  'https://mangasee123.com/manga/Kimi-ni-Koisuru-Satsujinki',
  'https://mangasee123.com/manga/Kono-Bijutsubu-Ni-Wa-Mondai-Ga-Aru',
  'https://mangasee123.com/manga/Kono-Oto-Tomare',
  'https://mangasee123.com/manga/Kubo-san-wa-Boku-Mobu-wo-Yurusanai',
  'https://mangasee123.com/manga/Kuro-No-Shoukanshi',
  'https://mangasee123.com/manga/Kuroiwa-Medaka-ni-Watashi-no-Kawaii-ga-Tsuujinai',
  'https://mangasee123.com/manga/Lust-Geass',
  'https://mangasee123.com/manga/Make-the-Exorcist-Fall-in-Love',
  'https://mangasee123.com/manga/Mamahaha-no-Tsurego-ga-Moto-Kanodatta',
  'https://mangasee123.com/manga/Maou-Gakuen-no-Hangyakusha',
  'https://mangasee123.com/manga/Maou-sama-No-Machizukuri',
  'https://mangasee123.com/manga/Meika-san-wa-Oshikorosenai',
  'https://mangasee123.com/manga/Mikadono-Sanshimai-wa-Angai-Choroi',
  'https://mangasee123.com/manga/Nihonkoku-Shoukan',
  'https://mangasee123.com/manga/One-Piece',
  'https://mangasee123.com/manga/Onepunch-Man',
  'https://mangasee123.com/manga/Osananajimi-to-wa-Romcom-ni-Naranai',
  'https://mangasee123.com/manga/Oshi-no-Ko',
  'https://mangasee123.com/manga/Parallel-Paradise',
  'https://mangasee123.com/manga/Please-Go-Home-Akutsu-san',
  'https://mangasee123.com/manga/Saki-the-Succubus-Hungers-Tonight',
  'https://mangasee123.com/manga/Saotome-Shimai-Wa-Manga-No-Tame-Nara',
  'https://mangasee123.com/manga/Sensei-Ore-ni-Kamawazu-Itte-Kudasai',
  'https://mangasee123.com/manga/Sex-and-Dungeon',
  'https://mangasee123.com/manga/Sono-Bisque-Doll-Wa-Koi-Wo-Suru',
  'https://mangasee123.com/manga/Sono-Mono-Nochi-Ni-nariie-Shinichirou',
  'https://mangasee123.com/manga/Sore-wa-rei-no-Shiwaza-desu',
  'https://mangasee123.com/manga/Soredemo-Ayumu-wa-Yosetekuru',
  'https://mangasee123.com/manga/Sukinako-ga-Megane-wo-Wasureta',
  'https://mangasee123.com/manga/The-Reincarnated-Inferior-Magic-Swordsman',
  'https://mangasee123.com/manga/Ultra-Alternate-Character',
  'https://mangasee123.com/manga/Ureshon',
  'https://mangasee123.com/manga/Watari-Kun-No-Xx-Ga-Houkai-Sunzen',
  'https://mangasee123.com/manga/semelparous',
];

const MangaLibrary: React.FC<MangaLibraryProps> = (props) => {
  const {
    mangas: recordMangas,
    navigation,
    history,
    cols,
    fontSize,
    searchInLibrary,
    query,
    orientation,
    appendNewChapters,
    type,
    sort: initialSort,
    setSortMethod,
    reversed: initialReversed,
    toggleReverseSort,
    restoreLibrary,
    mangasList: mangas,
  } = props;
  const { sortOptions, selectedSortOption, reverse, sort } = useSort(
    (_createSort) => {
      const createSort = (compareFn: (a: ReadingMangaInfo, b: ReadingMangaInfo) => number) => {
        return _createSort((a: string, b: string) => {
          const mangaA = history[a];
          const mangaB = history[b];
          return compareFn(mangaA, mangaB);
        });
      };
      return {
        'Age in library': createSort((a, b) => Date.parse(a.dateAddedInLibrary!) - Date.parse(b.dateAddedInLibrary!)),
        Alphabetical: createSort((a, b) => a.title.localeCompare(b.title)),
        'Chapter count': createSort((a, b) => Object.keys(a.chapters).length - Object.keys(b.chapters).length),
        'Genres count': createSort((a, b) => a.genres.length - b.genres.length),
        Source: createSort((a, b) => a.source.localeCompare(b.source)),
        'Number of updates': createSort((a, b) => a.newChapters - b.newChapters),
      };
    },
    initialSort,
    setSortMethod,
    initialReversed,
    toggleReverseSort
  );

  const [mangaList, setMangaList] = React.useState<string[]>(mangas.sort(selectedSortOption));
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [fetching, setFetching] = React.useState<boolean>(false);

  useMountedEffect(() => {
    setMangaList(insertionSort(mangas, selectedSortOption));
  }, [history]);

  useMountedEffect(() => {
    setRefreshing(false);
    if (refreshing) {
      if (fetching) {
        displayMessage('Please wait for the fetch operation to finish.');
      } else {
        setFetching(true);
        displayMessage('Fetching updates...');
        (async () => {
          try {
            await Promise.all(
              Object.keys(recordMangas).map(async (mangaKey) =>
                limit(async () => {
                  console.log(`fetching updates for ${mangaKey}`);
                  try {
                    const meta = await MangaHost.availableSources
                      .get(history[mangaKey].source)!
                      .getMeta(history[mangaKey]);
                    appendNewChapters({ ...history[mangaKey], ...meta });
                  } catch (e) {
                    console.error(e);
                    console.error(`The error occurred at ${mangaKey}`);
                  }
                })
              )
            );
          } finally {
            setFetching(false);
          }
        })();
      }
    }
  }, [refreshing]);

  const { width, height } = useWindowDimensions();
  const numOfColumnsPortrait = React.useMemo(() => {
    switch (orientation) {
      case Orientation.PORTRAIT_DOWN:
      case Orientation.PORTRAIT_UP:
        return Math.floor(width / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));
      case Orientation.LANDSCAPE_LEFT:
      case Orientation.LANDSCAPE_RIGHT:
      default:
        return Math.floor(height / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));
    }
  }, [cols]);
  const numOfColumnsLandscape = React.useMemo(() => {
    switch (orientation) {
      case Orientation.LANDSCAPE_LEFT:
      case Orientation.LANDSCAPE_RIGHT:
      default:
        return Math.floor(width / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));

      case Orientation.PORTRAIT_DOWN:
      case Orientation.PORTRAIT_UP:
        return Math.floor(height / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));
    }
  }, [cols]);
  const [expand, setExpand] = React.useState<boolean>(false);
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const handleOnRefresh = () => {
    setRefreshing(true);
  };
  const handleOnExpand = React.useCallback(() => {
    Keyboard.dismiss();
    setExpand(true);
  }, [setExpand]);
  const handleOnClose = React.useCallback(() => {
    setExpand(false);
  }, [setExpand]);

  const { header } = useSearchBar({
    title: 'Library',
    focusCondition: !expand,
    additionalButtons: (
      <>
        <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='filter-menu' />} onPress={handleOnExpand} />
        {/* <IconButton
          icon={<Icon bundle='MaterialCommunityIcons' name='code-array' />}
          onPress={() => {
          }}
        /> */}
      </>
    ),
    stateSetter: [query, searchInLibrary as any],
  });
  const theme = useTheme();

  useStatefulHeader(
    <>
      {header}
      <FilterModal
        sortOptions={sortOptions}
        onClose={handleOnClose}
        expand={expand}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
    </>
  );
  useMountedEffect(() => {
    setMangaList(mangas.filter((x) => titleIncludes(query)(history[x])).sort(selectedSortOption));
  }, [mangas.length, query, sort, reverse]);

  if (mangas.length === 0) return <LibraryIsEmpty />;

  if (query && mangas.length > 0 && mangaList.length === 0) return <NoItemsFound query={query} />;

  return (
    <>
      {fetching && <Progress type='bar' />}
      <FlatList
        key={orientation}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={
          orientation === Orientation.PORTRAIT_UP || orientation === Orientation.PORTRAIT_DOWN
            ? numOfColumnsPortrait
            : numOfColumnsLandscape
        }
        data={mangaList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleOnRefresh} />}
        contentContainerStyle={{
          paddingTop: pixelToNumber(theme.spacing(2)),
          paddingBottom: pixelToNumber(theme.spacing(24)),
        }}
        ListEmptyComponent={<MangaItemsLoading />}
      />
    </>
  );
};

export default connector(MangaLibrary);
