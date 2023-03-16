import Box, { AnimatedBox } from '@components/Box';
import React from 'react';
import connector, { ConnectedOverlayProps } from './Overlay.redux';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Text from '@components/Text';
import Button from '@components/Button';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Portal } from '@gorhom/portal';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import useRootNavigation from '@hooks/useRootNavigation';
import { StatusBar } from 'react-native';
import { useTheme } from '@emotion/react';
import Stack, { AnimatedStack } from '@components/Stack';
import { useLocalObject, useObject, useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { IMangaSchema, MangaSchema } from '@database/schemas/Manga';
import Realm from 'realm';
import displayMessage from '@helpers/displayMessage';
import { moderateScale } from 'react-native-size-matters';

const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';
const OVERLAY_TEXT_PRIMARY = { custom: 'rgba(255, 255, 255, 1)' };
const OVERLAY_TEXT_SECONDARY = { custom: 'rgba(255, 255, 255, 0.7)' };

const translateYOffset = moderateScale(-32);

const Overlay: React.FC<ConnectedOverlayProps> = (props) => {
  const {
    opacity,
    active,
    mangaTitle,
    chapter,
    manga,
    addIfNewSourceToLibrary,
    totalPages,
  } = props;
  const realm = useRealm();
  const translateY = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [0, translateYOffset]),
  );
  const [isBookmarked, setIsBookmarked] = React.useState<boolean>(
    manga.inLibrary,
  );
  const [page, setPage] = React.useState<number>(1);
  React.useEffect(() => {
    const callback: Realm.ObjectChangeCallback<IMangaSchema> = (change) => {
      setIsBookmarked(change.inLibrary);
      if (change.currentlyReadingChapter)
        setPage(change.currentlyReadingChapter.index + 1);
    };
    manga.addListener(callback);
    return () => {
      manga.removeListener(callback);
    };
  }, []);
  const theme = useTheme();

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const pageCounterStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const navigation = useRootNavigation();

  function handleOnBack() {
    if (navigation.canGoBack()) navigation.goBack();
  }

  function handleOnBookmark() {
    realm.write(() => {
      addIfNewSourceToLibrary(manga.source);
      manga.inLibrary = !manga.inLibrary;
      displayMessage(
        manga.inLibrary ? 'Added to library' : 'Removed from library',
      );
      if (manga.inLibrary) manga.dateAddedInLibrary = Date.now();
      else manga.dateAddedInLibrary = undefined;
    });
  }

  return (
    <Portal>
      <Box
        height="100%"
        width="100%"
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        top={0}
        justify-content="space-between"
      >
        <AnimatedBox
          style={style}
          background-color={OVERLAY_COLOR}
          pt={(StatusBar.currentHeight ?? 0) + theme.style.spacing.s}
          pb="s"
          px="m"
        >
          <Stack flex-direction="row" space="s" justify-content="space-between">
            <IconButton
              icon={<Icon type="font" name="arrow-left" />}
              onPress={handleOnBack}
              color={OVERLAY_TEXT_SECONDARY}
            />
            <Stack flex-direction="row" space="s">
              <IconButton
                onPress={handleOnBookmark}
                icon={
                  <Icon
                    type="font"
                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  />
                }
                color={OVERLAY_TEXT_SECONDARY}
              />
              <IconButton
                icon={<Icon type="font" name="cog" />}
                color={OVERLAY_TEXT_SECONDARY}
              />
            </Stack>
          </Stack>
          <Text numberOfLines={1} color={OVERLAY_TEXT_PRIMARY}>
            {mangaTitle}
          </Text>
          <Text numberOfLines={1} color={OVERLAY_TEXT_SECONDARY}>
            {chapter.name}
          </Text>
        </AnimatedBox>
        {totalPages != null && (
          <AnimatedBox
            style={pageCounterStyle}
            position="absolute"
            bottom={theme.style.spacing.xl}
            background-color={OVERLAY_COLOR}
            align-self="center"
            py={moderateScale(2)}
            px="s"
            border-radius={moderateScale(4)}
          >
            <Text bold>
              {page} / {totalPages}
            </Text>
          </AnimatedBox>
        )}
        <AnimatedBox
          py="s"
          px="m"
          background-color={OVERLAY_COLOR}
          style={style}
        >
          <Stack flex-direction="row" space="s" justify-content="space-evenly">
            <IconButton
              icon={<Icon type="font" name="phone-rotate-portrait" />}
            />
            <IconButton
              icon={<Icon type="font" name="image-filter-center-focus" />}
            />
            <IconButton icon={<Icon type="font" name="image" />} />
            <IconButton icon={<Icon type="font" name="book-open-variant" />} />
          </Stack>
        </AnimatedBox>
      </Box>
    </Portal>
  );
};

export default connector(React.memo(Overlay));
