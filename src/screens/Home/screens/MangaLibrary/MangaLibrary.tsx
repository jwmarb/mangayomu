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
} from '@components/core';
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
import React from 'react';
import { Keyboard, useWindowDimensions } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { useTheme } from 'styled-components/native';
import LibraryIsEmpty from './components/LibraryIsEmpty';
import NoItemsFound from './components/NoItemsFound';
import PropTypes from 'prop-types';
import MangaLibraryRLV from '@screens/Home/screens/MangaLibrary/components/MangaLibraryRLV';
import MangaLibraryFlatList from '@screens/Home/screens/MangaLibrary/components/MangaLibraryFlatList/MangaLibraryFlatList';

const MangaLibrary: React.FC<MangaLibraryProps> = (props) => {
  if (props.useRecyclerListView) return <MangaLibraryRLV {...props} />;

  return <MangaLibraryFlatList {...props} />;
};

const MangaLibraryScreen: React.FC<MangaLibraryProps> = (props) => {
  const focused = useIsFocused();
  const { ready, Fallback } = useLazyLoading();

  if (focused && ready) return <MangaLibrary {...props} />;
  return Fallback;
};

export default connector(MangaLibraryScreen);
