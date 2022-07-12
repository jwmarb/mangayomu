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

  const menuItems = React.useMemo(
    () =>
      [
        { text: 'Select...', isTitle: true },
        {
          text: 'All Chapters',
          onPress: () => {
            onSelectAll(true);
          },
        },
        {
          text: 'All Downloaded Chapters',
          onPress: () => {
            onSelectDownloadedChapters();
          },
        },
        {
          text: 'All Unread Chapters',
          onPress: () => {
            onSelectUnreadChapters();
          },
        },
        {
          text: 'All Read Chapters',
          onPress: () => {
            onSelectReadChapters();
          },
        },
        {
          text: 'Deselect All',
          isDestructive: true,
          onPress: () => {
            onSelectAll(false);
          },
        },
      ] as MenuItemProps[],
    []
  );

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
          <HoldItem items={menuItems}>
            <Checkbox onChange={onSelectAll} checked={checked} />
          </HoldItem>
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
