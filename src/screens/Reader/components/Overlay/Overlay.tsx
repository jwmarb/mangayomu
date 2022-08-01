import { IconButton, Typography, Icon, Flex, Spacer, Button, MenuOption, Modal } from '@components/core';
import { useRootNavigation } from '@navigators/Root';
import { OverlayWrapper, OverlayFooterWrapper } from '@screens/Reader/components/Overlay/Overlay.base';
import connector, { ConnectedOverlayProps } from '@screens/Reader/components/Overlay/Overlay.redux';
import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';

import ReaderSettings from '@screens/Reader/components/Overlay/components/ReaderSettings';
import OverlayHeader from '@screens/Reader/components/Overlay/components/OverlayHeader';
import OverlayPage from '@screens/Reader/components/Overlay/components/OverlayPage';
import OverlayFooter from '@screens/Reader/components/Overlay/components/OverlayFooter';
import OverlayPageSlider from '@screens/Reader/components/Overlay/components/OverlayPageSlider';

const Overlay: React.FC<ConnectedOverlayProps> = (props) => {
  const {
    show,
    currentChapter,
    manga,
    indexOffset,
    index,
    inLibrary,
    toggleLibrary,
    numberOfPages,
    setIndexPage,
    readerSetting,
    setOrientationForSeries,
    showPageNumber,
    flatListRef,
  } = props;
  const page = React.useMemo(() => index - indexOffset + 1, [index]);
  const bottom = useSharedValue(0);
  const { width, height } = useWindowDimensions();
  const [visible, setVisible] = React.useState<boolean>(false);

  const theme = useTheme();
  React.useEffect(() => {
    if (currentChapter) setIndexPage(manga.link, currentChapter.link, page - 1);
  }, [page]);

  React.useEffect(() => {
    if (show) bottom.value = withTiming(pixelToNumber(theme.spacing(9)), { duration: 100, easing: Easing.linear });
    else bottom.value = withTiming(0, { duration: 100, easing: Easing.linear });
  }, [show]);

  const pageStyle = useAnimatedStyle(() => ({
    bottom: bottom.value,
  }));

  const navigation = useRootNavigation();
  const handleOnBookmarkPress = React.useCallback(() => {
    toggleLibrary(manga);
  }, [toggleLibrary]);
  const handleOnBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOnClose = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handleOnOpen = React.useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  return (
    <OverlayWrapper width={width} height={height}>
      {show && (
        <OverlayHeader
          onBack={handleOnBack}
          onBookmark={handleOnBookmarkPress}
          onOpen={handleOnOpen}
          currentChapter={currentChapter}
          inLibrary={inLibrary}
          manga={manga}
        />
      )}
      <OverlayFooterWrapper>
        {showPageNumber && numberOfPages && (
          <OverlayPage numberOfPages={numberOfPages} page={page} pageStyle={pageStyle} />
        )}
        {show && (
          <Flex direction='column'>
            {numberOfPages && (
              <OverlayPageSlider
                flatListRef={flatListRef}
                page={page}
                totalPages={numberOfPages}
                offset={indexOffset}
              />
            )}
            <OverlayFooter manga={manga} />
          </Flex>
        )}
      </OverlayFooterWrapper>
      <ReaderSettings manga={manga} visible={visible} onClose={handleOnClose} />
    </OverlayWrapper>
  );
};

export default connector(Overlay);
