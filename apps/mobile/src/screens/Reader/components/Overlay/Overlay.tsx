import Box from '@components/Box';
import React from 'react';
import connector, { ConnectedOverlayProps } from './Overlay.redux';
import {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { Portal } from '@gorhom/portal';
import { useRealm } from '@database/main';
import displayMessage from '@helpers/displayMessage';
import { moderateScale } from 'react-native-size-matters';
import { ParsedUserReaderSettingsContext } from '@screens/Reader/context/ParsedUserReaderSettings';
import ReaderSettingsMenu from '@screens/Reader/components/ReaderSettingsMenu';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import ImageMenu from '@screens/Reader/components/ImageMenu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OverlayHeader from '@screens/Reader/components/Overlay/components/OverlayHeader/OverlayHeader';
import PageCounter from '@screens/Reader/components/Overlay/components/PageCounter/PageCounter';
import OverlayFooter from '@screens/Reader/components/Overlay/components/OverlayFooter/OverlayFooter';
import useRootNavigation from '@hooks/useRootNavigation';
import PageSliderNavigator from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator';
import { chapterIndices } from '@redux/slices/reader';
import { ReadingDirection } from '@redux/slices/settings';
import { PageSliderNavigatorMethods } from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator.interfaces';
import { MangaKeyContext } from '@screens/Reader/context/MangaKey';

const pageSliderTranslateYOffset = moderateScale(-78);

const Overlay: React.FC<ConnectedOverlayProps> = (props) => {
  const {
    opacity,
    showPageNumber,
    currentPage: page,
    chapter,
    manga,
    addIfNewSourceToLibrary,
    readerProps,
    scrollRef,
    pageSliderNavRef,
    isFinishedInitialScrollOffset,
    topOverlayStyle,
    imageMenuRef,
    savedChapterInfo,
  } = props;
  const insets = useSafeAreaInsets();
  const totalPages = savedChapterInfo.numberOfPages;
  const textOpacity = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [1, 0]),
  );
  const reversedNav =
    readerProps.readingDirection === ReadingDirection.RIGHT_TO_LEFT;
  const handleOnSkipPrevious = React.useCallback(() => {
    const indices = chapterIndices.get(chapter._id);
    if (indices != null) {
      const { start, end } = indices;
      scrollRef.current?.scrollToIndex({
        animated: true,
        index: reversedNav ? end : start,
      });
    }
  }, [reversedNav, chapter._id]);
  const handleOnSnapToPoint = React.useCallback(
    (index: number) => {
      const indices = chapterIndices.get(chapter._id);
      if (indices != null) {
        const { start, end } = indices;
        scrollRef.current?.scrollToIndex({
          animated: false,
          index: reversedNav ? end - index : start + index,
        });
      }
    },
    [chapter._id, reversedNav],
  );

  const handleOnSkipNext = React.useCallback(() => {
    const indices = chapterIndices.get(chapter._id);
    if (indices != null) {
      const { start, end } = indices;
      scrollRef.current?.scrollToIndex({
        animated: true,
        index: reversedNav ? start : end,
      });
    }
  }, [reversedNav, chapter._id]);
  const pageSliderTranslateY = useDerivedValue(() =>
    interpolate(
      opacity.value,
      [0, 1],
      [0, pageSliderTranslateYOffset - insets.bottom],
    ),
  );

  const navigation = useRootNavigation();

  const isBookmark = manga.inLibrary;

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const pageCounterStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));
  const pageSliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pageSliderTranslateY.value }],
    opacity: opacity.value,
  }));

  const handleOnPressTitle = React.useCallback(() => {
    navigation.replace('MangaView', {
      imageCover: manga.imageCover,
      link: manga.link,
      source: manga.source,
      title: manga.title,
    });
  }, [navigation, manga.imageCover, manga._id, manga.source, manga.title]);

  const handleOnBack = React.useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const handleOnOpenSettingsMenu = React.useCallback(() => {
    ref.current?.snapToIndex(1);
  }, []);

  const handleOnBookmark = React.useCallback(() => {
    manga.update((obj) => {
      addIfNewSourceToLibrary(obj.source);
      obj.inLibrary = !obj.inLibrary;
      displayMessage(
        obj.inLibrary ? 'Added to library' : 'Removed from library',
      );
      if (obj.inLibrary) obj.dateAddedInLibrary = Date.now();
      else obj.dateAddedInLibrary = undefined;
    });
  }, [manga.update]);

  const bottomOverlayTranslation = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [64, 0]),
  );

  const animatedBottomOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomOverlayTranslation.value }],
  }));
  const bottomOverlayStyle = React.useMemo(
    () => [animatedBottomOverlayStyle, style],
    [],
  );
  const ref = React.useRef<BottomSheetMethods>(null);

  const memoPageSliderStyle = React.useMemo(() => pageSliderStyle, []);

  const memoStyle = React.useMemo(() => style, []);

  // console.log('\n\n\nRERENDER OVERLAY FULl');

  return (
    <Portal>
      <ReaderSettingsMenu ref={ref} mangaKey={manga.link} />
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
        <OverlayHeader
          topOverlayStyle={topOverlayStyle}
          style={memoStyle}
          mangaTitle={manga.title}
          chapterTitle={chapter.name}
          onBookmark={handleOnBookmark}
          onOpenSettingsMenu={handleOnOpenSettingsMenu}
          onBack={handleOnBack}
          onTitlePress={handleOnPressTitle}
          isBookmarked={isBookmark}
        />
        {/* <Box
          position="absolute"
          bottom={500}
          left={0}
          right={0}
          justify-content="space-around"
          flex-direction="row"
        >
          <Stack space="s">
            <Button
              label="get_prev_chap"
              variant="contained"
              onPress={() => {
                if (previousChapter) fetchPages(previousChapter);
              }}
            />
            <Button
              label="get_prev_chap_and_throw_error"
              variant="contained"
              color="error"
              onPress={() => {
                if (previousChapter) fetchPages(previousChapter, null, true);
              }}
            />
          </Stack>
          <Stack space="s">
            <Button
              label="get_next_chap"
              variant="contained"
              onPress={() => {
                if (nextChapter) fetchPages(nextChapter);
              }}
            />
            <Button
              label="get_next_chap_and_throw_error"
              variant="contained"
              color="error"
              onPress={() => {
                if (nextChapter) fetchPages(nextChapter, null, true);
              }}
            />
          </Stack>
        </Box> */}
        <ParsedUserReaderSettingsContext.Provider value={readerProps}>
          <PageSliderNavigator
            isFinishedInitialScrollOffset={isFinishedInitialScrollOffset}
            initialChapterPageIndex={savedChapterInfo.indexPage}
            ref={pageSliderNavRef}
            onSnapToPoint={handleOnSnapToPoint}
            totalPages={totalPages}
            style={memoPageSliderStyle}
            onSkipPrevious={handleOnSkipPrevious}
            onSkipNext={handleOnSkipNext}
          />
        </ParsedUserReaderSettingsContext.Provider>
        {showPageNumber && (
          <PageCounter
            page={page}
            totalPages={totalPages}
            pageCounterStyle={pageCounterStyle}
          />
        )}
        <MangaKeyContext.Provider value={manga.link}>
          <OverlayFooter style={bottomOverlayStyle} />
        </MangaKeyContext.Provider>
      </Box>
    </Portal>
  );
};

export default connector(Overlay);
