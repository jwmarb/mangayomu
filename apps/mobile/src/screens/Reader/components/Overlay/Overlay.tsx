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
import { ReaderContext } from '@screens/Reader/Reader';
import ReaderSettingsMenu from '@screens/Reader/components/ReaderSettingsMenu';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import ImageMenu from '@screens/Reader/components/ImageMenu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OverlayHeader from '@screens/Reader/components/Overlay/components/OverlayHeader/OverlayHeader';
import PageCounter from '@screens/Reader/components/Overlay/components/PageCounter/PageCounter';
import OverlayFooter from '@screens/Reader/components/Overlay/components/OverlayFooter/OverlayFooter';
import useRootNavigation from '@hooks/useRootNavigation';
import useBookmark from '@screens/Reader/components/Overlay/hooks/useBookmark';
import PageSliderNavigator from '@screens/Reader/components/Overlay/components/PageSliderNavigator/PageSliderNavigator';

const pageSliderTranslateYOffset = moderateScale(-64);

const Overlay: React.FC<ConnectedOverlayProps> = (props) => {
  const {
    opacity,
    showPageNumber,
    currentPage: page,
    chapter,
    manga,
    addIfNewSourceToLibrary,
  } = props;
  const insets = useSafeAreaInsets();
  const realm = useRealm();
  const totalPages = chapter.numberOfPages;
  const textOpacity = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [1, 0]),
  );
  const pageSliderTranslateY = useDerivedValue(() =>
    interpolate(
      opacity.value,
      [0, 1],
      [0, pageSliderTranslateYOffset - insets.bottom],
    ),
  );

  const navigation = useRootNavigation();

  const isBookmark = useBookmark(manga);

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
  }, [navigation, manga.imageCover, manga.link, manga.source, manga.title]);

  const handleOnBack = React.useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);

  const handleOnOpenSettingsMenu = React.useCallback(() => {
    ref.current?.snapToIndex(1);
  }, []);

  const handleOnBookmark = React.useCallback(() => {
    realm.write(() => {
      addIfNewSourceToLibrary(manga.source);
      manga.inLibrary = !manga.inLibrary;
      displayMessage(
        manga.inLibrary ? 'Added to library' : 'Removed from library',
      );
      if (manga.inLibrary) manga.dateAddedInLibrary = Date.now();
      else manga.dateAddedInLibrary = undefined;
    });
  }, [
    manga.inLibrary,
    manga.dateAddedInLibrary,
    addIfNewSourceToLibrary,
    realm,
  ]);

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

  // console.log('\n\n\nRERENDER OVERLAY FULl');

  return (
    <Portal>
      <ReaderSettingsMenu ref={ref} mangaKey={manga._id} />
      <ImageMenu />
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
          style={React.useMemo(() => style, [])}
          opacity={opacity}
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
        <PageSliderNavigator
          opacity={opacity}
          style={React.useMemo(() => pageSliderStyle, [])}
        />
        {showPageNumber && (
          <PageCounter
            page={page}
            totalPages={totalPages}
            pageCounterStyle={pageCounterStyle}
          />
        )}
        <ReaderContext.Provider
          value={React.useMemo(() => ({ mangaKey: manga._id }), [manga._id])}
        >
          <OverlayFooter style={bottomOverlayStyle} />
        </ReaderContext.Provider>
      </Box>
    </Portal>
  );
};

export default connector(Overlay);
