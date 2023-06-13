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
  } = props;
  const insets = useSafeAreaInsets();
  const realm = useRealm();
  const totalPages = chapter.numberOfPages;
  const translateY = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [0, translateYOffset - insets.bottom]),
  );
  function handleOnOpenSettingsMenu() {
    ref.current?.snapToIndex(1);
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const pageCounterStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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

  const bottomOverlayTranslation = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], [64, 0]),
  );

  const animatedBottomOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomOverlayTranslation.value }],
  }));
  const bottomOverlayStyle = React.useMemo(
    () => [animatedBottomOverlayStyle, style],
    [style, animatedBottomOverlayStyle],
  );
  const ref = React.useRef<BottomSheetMethods>(null);

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
          style={style}
          opacity={opacity}
          manga={manga}
          chapter={chapter}
          onBookmark={handleOnBookmark}
          onOpenSettingsMenu={handleOnOpenSettingsMenu}
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
        {showPageNumber && (
          <PageCounter
            page={page}
            totalPages={totalPages}
            pageCounterStyle={pageCounterStyle}
          />
        )}
        <ReaderContext.Provider value={manga._id}>
          <OverlayFooter style={bottomOverlayStyle} />
        </ReaderContext.Provider>
      </Box>
    </Portal>
  );
};

export default connector(React.memo(Overlay));
