import { Typography, Spacer, Icon, Button, Modal, ListItem, List, Flex, IconButton } from '@components/core';
import {
  ChapterHeaderContainer,
  ChapterLoadingIndicator,
  ChapterLoadingIndicatorBackground,
} from '@screens/MangaViewer/components/ChapterHeader/ChapterHeader.base';
import { ChapterHeaderProps } from '@screens/MangaViewer/components/ChapterHeader/ChapterHeader.interfaces';
import LoadingChapters from '@screens/MangaViewer/components/LoadingChapters';
import { MangaMultilingualChapter } from '@services/scraper/scraper.interfaces';
import { ISOLangCode, languages } from '@utils/languageCodes';
import MangaValidator from '@utils/MangaValidator';
import React from 'react';
import { Dimensions } from 'react-native';
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
const { width } = Dimensions.get('window');
const halfWidth = width / 2;

const ChapterHeader: React.FC<ChapterHeaderProps> = (props) => {
  const { chapters, handleOnOpenModal, loading, refresh, language, onChangeLanguage } = props;
  const opacity = useSharedValue(1);
  const bgOpacity = useSharedValue(0);
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

  const menuItems: MenuItemProps[] = React.useMemo(() => {
    if (chapters == null) return [];
    if (multilingualChapters) {
      const availableLanguages: ISOLangCode[] = Object.keys(
        (chapters as MangaMultilingualChapter[]).reduce((prev, curr) => {
          if (prev[curr.language] != null) return prev;

          return { ...prev, [curr.language]: curr.language };
        }, {} as Record<ISOLangCode, ISOLangCode>)
      ).sort() as ISOLangCode[];

      return [
        {
          text: 'Available languages',
          isTitle: true,
          withSeparator: true,
        },
        ...availableLanguages.map(
          (x): MenuItemProps => ({
            text: languages[x].name,
            onPress: () => {
              onChangeLanguage(x);
            },
          })
        ),
      ];
    }
    return [];
  }, [multilingualChapters, chapters]);

  return (
    <>
      <ChapterHeaderContainer>
        <ChapterLoadingIndicator style={loadingStyle} />
        <ChapterLoadingIndicatorBackground style={bgStyle} />
        <Typography variant='subheader'>{numOfChapters ? `Chapters - ${numOfChapters}` : 'Updating...'}</Typography>
        <Spacer x={2} />
        <Flex>
          {multilingualChapters && (
            <HoldItem activateOn='tap' items={menuItems}>
              <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='translate' />} disabled={loading} />
            </HoldItem>
          )}
          <IconButton icon={<Icon bundle='Feather' name='refresh-cw' />} onPress={refresh} disabled={loading} />
          <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='sort' />} onPress={handleOnOpenModal} />
        </Flex>
      </ChapterHeaderContainer>
      {loading && <LoadingChapters />}
    </>
  );
};

export default React.memo(ChapterHeader);
