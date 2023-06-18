import { BOOK_DIMENSIONS } from '@theme/constants';
import { AnimatedBox } from '@components/Box';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import useRootNavigation from '@hooks/useRootNavigation';
import { Manga } from '@mangayomu/mangascraper';
import { AUTO_HEIGHT_SCALAR } from '@redux/slices/settings';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { ScaledSheet } from 'react-native-size-matters';
import { MangaSchema } from '@database/schemas/Manga';
import mangaSchemaToManga from '@helpers/mangaSchemaToManga';

const styles = ScaledSheet.create({
  cover: {
    width: '64@ms',
    height: `${Math.round(
      (64 / (BOOK_DIMENSIONS.width / BOOK_DIMENSIONS.height)) *
        AUTO_HEIGHT_SCALAR,
    )}@ms`,
    borderRadius: '8@ms',
  },
});

const mangaHistoryItemStyles = StyleSheet.create({
  error: {
    position: 'absolute',
    zIndex: -1,
  },
});

interface StaticCoverProps {
  manga: Manga | MangaSchema;
}

const StaticCover: React.FC<StaticCoverProps> = (props) => {
  const { manga } = props;
  const loadingOpacity = useSharedValue(0);
  const navigation = useRootNavigation();
  const theme = useTheme();
  function handleOnPressCover() {
    if (manga != null)
      navigation.navigate('MangaView', mangaSchemaToManga(manga));
  }

  function handleOnLoadStart() {
    loadingOpacity.value = 1;
  }

  function handleOnLoadEnd() {
    loadingOpacity.value = 0;
  }

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  const styledError = React.useMemo(
    () => [mangaHistoryItemStyles.error, styles.cover],
    [styles.cover, mangaHistoryItemStyles.error],
  );
  const fastImageStyle = React.useMemo(
    () => [styles.cover, { backgroundColor: theme.palette.skeleton }],
    [theme.palette.skeleton],
  );
  return (
    <TouchableWithoutFeedback disallowInterruption onPress={handleOnPressCover}>
      <FastImage
        onLoadStart={handleOnLoadStart}
        onLoadEnd={handleOnLoadEnd}
        source={{ uri: manga.imageCover }}
        style={fastImageStyle}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Image
        source={require('@assets/No-Image-Placeholder.png')}
        style={styledError}
      />
      <AnimatedBox
        style={loadingStyle}
        position="absolute"
        justify-content="center"
        bottom={0}
        left={0}
        right={0}
        top={0}
      >
        <Progress size="small" />
      </AnimatedBox>
    </TouchableWithoutFeedback>
  );
};

export default StaticCover;
