import Checkbox from '@components/Checkbox/Checkbox';
import {
  Typography,
  Spacer,
  Icon,
  Button,
  Modal,
  ListItem,
  List,
  Flex,
  IconButton,
  HeaderBuilder,
  MenuOption,
} from '@components/core';
import { AppState } from '@redux/store';
import {
  ChapterHeaderContainer,
  ChapterLoadingIndicator,
  ChapterLoadingIndicatorBackground,
} from '@screens/MangaViewer/components/ChapterHeader/ChapterHeader.base';
import { ChapterHeaderProps } from '@screens/MangaViewer/components/ChapterHeader/ChapterHeader.interfaces';
import LanguageItem from '@screens/MangaViewer/components/ChapterHeader/components/LanguageItem';
import LoadingChapters from '@screens/MangaViewer/components/LoadingChapters';
import { MangaMultilingualChapter } from '@services/scraper/scraper.interfaces';
import { ISOLangCode, languages } from '@utils/languageCodes';
import MangaValidator from '@utils/MangaValidator';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components/native';
const { width } = Dimensions.get('window');
const halfWidth = width / 2;

const ChapterHeader: React.FC<ChapterHeaderProps> = (props) => {
  const {
    checked,
    chapters,
    handleOnOpenModal,
    loading,
    refresh,
    language,
    onChangeLanguage,
    onSelectAll,
    onSelectDownloadedChapters,
    onSelectReadChapters,
    onSelectUnreadChapters,
  } = props;
  const opacity = useSharedValue(1);
  const bgOpacity = useSharedValue(0);
  const [visible, setVisible] = React.useState<boolean>(false);
  const translateX = useSharedValue(-halfWidth);
  React.useEffect(() => {
    if (loading) {
      opacity.value = withTiming(1, { duration: 100, easing: Easing.ease });
      bgOpacity.value = withTiming(0.55, { duration: 100, easing: Easing.ease });
      translateX.value = withRepeat(
        withSequence(
          withTiming(width, { duration: 1000, easing: Easing.out(Easing.sin) }),
          withTiming(-halfWidth, { duration: 0 })
        ),
        -1
      );
    } else {
      bgOpacity.value = withTiming(0, { duration: 100, easing: Easing.ease });
      opacity.value = withTiming(0, { duration: 100, easing: Easing.ease });
    }
  }, [loading]);

  useDerivedValue(() => {
    if (opacity.value === 0) translateX.value = -halfWidth;
  }, [opacity.value]);

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const handleOnPress = () => {
    setVisible(true);
  };

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const multilingualChapters = React.useMemo(() => {
    return chapters != null && chapters.every(MangaValidator.isMultilingualChapter);
  }, [chapters]);

  const numOfChapters: number | null = React.useMemo(() => {
    if (chapters == null) return null;
    if (multilingualChapters) {
      return chapters.filter((chapter) => (chapter as MangaMultilingualChapter).language === language).length;
    }
    return chapters.length;
  }, [chapters, language, multilingualChapters]);

  const chapterLanguages = React.useMemo(() => {
    if (chapters == null) return [];
    if (multilingualChapters) {
      const availableLanguages: ISOLangCode[] = Object.keys(
        (chapters as MangaMultilingualChapter[]).reduce((prev, curr) => {
          if (prev[curr.language] != null) return prev;

          return { ...prev, [curr.language]: curr.language };
        }, {} as Record<ISOLangCode, ISOLangCode>)
      ).sort() as ISOLangCode[];

      return availableLanguages;
    }
    return [];
  }, [multilingualChapters, chapters]);

  const handleOnSelect = React.useCallback(
    (x: ISOLangCode) => {
      onChangeLanguage(x);
    },
    [onChangeLanguage]
  );

  const handleOnSelectAll = React.useCallback(() => {
    onSelectAll(true);
  }, [onSelectAll]);

  const handleOnDeselectAll = React.useCallback(() => {
    onSelectAll(false);
  }, [onSelectAll]);

  const ref = React.useRef<Menu>(null);

  const theme = useTheme();

  function handleOnLongPress() {
    ref.current?.open();
  }

  return (
    <>
      <ChapterHeaderContainer>
        <ChapterLoadingIndicator style={loadingStyle} />
        <ChapterLoadingIndicatorBackground style={bgStyle} />
        <Typography variant='subheader'>
          {numOfChapters != null ? `Chapters - ${numOfChapters}` : 'Updating...'}
        </Typography>
        <Spacer x={2} />
        <Flex alignItems='center'>
          {multilingualChapters && (
            <IconButton
              icon={<Icon bundle='MaterialCommunityIcons' name='translate' />}
              onPress={handleOnPress}
              disabled={loading}
            />
          )}
          <IconButton icon={<Icon bundle='Feather' name='refresh-cw' />} onPress={refresh} disabled={loading} />
          <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='sort' />} onPress={handleOnOpenModal} />
          <Menu ref={ref}>
            <MenuTrigger>
              <Checkbox onChange={onSelectAll} checked={checked} onLongPress={handleOnLongPress} useGestureHandler />
            </MenuTrigger>
            <MenuOptions customStyles={theme.menuOptionsStyle}>
              <MenuOption text='All chapters' onPress={handleOnSelectAll} />
              <MenuOption text='All downloaded chapters' onPress={onSelectDownloadedChapters} />
              <MenuOption text='All unread chapters' onPress={onSelectUnreadChapters} />
              <MenuOption text='All read chapters' onPress={onSelectReadChapters} />
              <MenuOption text='Deselect all' onPress={handleOnDeselectAll} />
            </MenuOptions>
          </Menu>
        </Flex>
      </ChapterHeaderContainer>
      {loading && <LoadingChapters />}
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <HeaderBuilder paper removeStatusBarPadding horizontalPadding verticalPadding>
          <Typography variant='subheader'>Select a language</Typography>
        </HeaderBuilder>
        <List>
          {chapterLanguages.map((x) => (
            <LanguageItem isoCode={x} onSelect={handleOnSelect} selected={language === x} key={x} />
          ))}
        </List>
      </Modal>
    </>
  );
};

export default React.memo(ChapterHeader);
