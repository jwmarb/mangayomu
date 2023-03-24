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
import { useTheme } from '@emotion/react';
import Stack, { AnimatedStack } from '@components/Stack';
import { useLocalObject, useObject, useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { IMangaSchema, MangaSchema } from '@database/schemas/Manga';
import Realm from 'realm';
import displayMessage from '@helpers/displayMessage';
import { moderateScale } from 'react-native-size-matters';
import { Menu, MenuItem } from '@components/Menu';
import { ReadingDirection } from '@redux/slices/settings';
import ReaderDirection from '@screens/Reader/components/Overlay/components/ReaderDirection';
import { ReaderContext } from '@screens/Reader/Reader';
import ImageScaling from '@screens/Reader/components/Overlay/components/ImageScaling';
import ZoomStartPosition from '@screens/Reader/components/Overlay/components/ZoomStartPosition';
import DeviceOrientation from '@screens/Reader/components/Overlay/components/DeviceOrientation';
import { FullWindowOverlay } from 'react-native-screens';
import { StyleSheet } from 'react-native';
import ReaderSettingsMenu from '@screens/Reader/components/ReaderSettingsMenu';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import ImageMenu from '@screens/Reader/components/ImageMenu';

export const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.5)';
export const OVERLAY_TEXT_PRIMARY = { custom: 'rgba(255, 255, 255, 1)' };
export const OVERLAY_TEXT_SECONDARY = { custom: 'rgba(255, 255, 255, 0.7)' };

const translateYOffset = moderateScale(-32);

const Overlay: React.FC<ConnectedOverlayProps> = (props) => {
  const {
    opacity,
    showPageNumber,
    currentPage: page,
    mangaTitle,
    chapter,
    manga,
    addIfNewSourceToLibrary,
    totalPages,
    imageMenuRef,
  } = props;
  const realm = useRealm();
  const translateY = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [0, translateYOffset]),
  );
  const [isBookmarked, setIsBookmarked] = React.useState<boolean>(
    manga.inLibrary,
  );
  React.useEffect(() => {
    const callback: Realm.ObjectChangeCallback<IMangaSchema> = (change) => {
      setIsBookmarked(change.inLibrary);
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

  const topOverlayTranslation = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [-64, 0]),
  );
  const bottomOverlayTranslation = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [64, 0]),
  );

  const animatedTopOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: topOverlayTranslation.value }],
  }));
  const topOverlayStyle = React.useMemo(
    () => [animatedTopOverlayStyle, style],
    [animatedTopOverlayStyle, style],
  );

  const animatedBottomOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomOverlayTranslation.value }],
  }));
  const bottomOverlayStyle = React.useMemo(
    () => [animatedBottomOverlayStyle, style],
    [style, animatedBottomOverlayStyle],
  );
  const ref = React.useRef<BottomSheetMethods>(null);
  function handleOnOpenSettingsMenu() {
    ref.current?.snapToIndex(1);
  }

  return (
    <Portal>
      <ReaderSettingsMenu ref={ref} mangaKey={manga._id} />
      <ImageMenu ref={imageMenuRef} />
      <Box
        z-index={-1}
        pointerEvents="box-none"
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
          style={topOverlayStyle}
          background-color={OVERLAY_COLOR}
          pt={theme.style.spacing.s}
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
                onPress={handleOnOpenSettingsMenu}
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
        {page && totalPages && showPageNumber ? (
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
            <Text bold variant="badge" color={OVERLAY_TEXT_PRIMARY}>
              {page} / {totalPages}
            </Text>
          </AnimatedBox>
        ) : undefined}
        <AnimatedBox
          px="m"
          background-color={OVERLAY_COLOR}
          style={bottomOverlayStyle}
        >
          <ReaderContext.Provider value={{ mangaKey: manga._id }}>
            <Stack
              flex-direction="row"
              space="s"
              justify-content="space-evenly"
            >
              <DeviceOrientation />
              <ZoomStartPosition />
              <ImageScaling />
              <ReaderDirection />
            </Stack>
          </ReaderContext.Provider>
        </AnimatedBox>
      </Box>
    </Portal>
  );
};

export default connector(React.memo(Overlay));
