import { BOOK_DIMENSIONS } from '@theme/constants';
import { AnimatedBox } from '@components/Box';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import useRootNavigation from '@hooks/useRootNavigation';
import { Manga } from '@mangayomu/mangascraper/src';
import { AUTO_HEIGHT_SCALAR } from '@redux/slices/settings';
import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { MangaSchema } from '@database/schemas/Manga';
import mangaSchemaToManga from '@helpers/mangaSchemaToManga';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import useImageHandler from '@components/Cover/useImageHandler';

const mangaHistoryItemStyles = StyleSheet.create({
  error: {
    position: 'absolute',
    zIndex: -1,
  },
});

interface StaticCoverProps {
  manga: Manga | MangaSchema | LocalMangaSchema;
  scale?: number;
  sharp?: boolean;
}

const StaticCover: React.FC<StaticCoverProps> = (props) => {
  const { manga, scale = 1, sharp = false } = props;
  const { loadingOpacity, opacity, source, onLoad, onLoadStart, onError } =
    useImageHandler({
      cover: manga.imageCover,
      manga:
        'link' in manga
          ? manga
          : {
              link: manga._id,
              imageCover: manga.imageCover,
              title: manga.title,
              source: manga.source,
            },
    });

  const styles = React.useMemo(
    () => ({
      cover: {
        width: moderateScale(scale * 64),
        height: moderateScale(
          Math.round(
            ((scale * 64) / (BOOK_DIMENSIONS.width / BOOK_DIMENSIONS.height)) *
              AUTO_HEIGHT_SCALAR,
          ),
        ),
        borderRadius: sharp ? undefined : moderateScale(8),
      },
    }),
    [scale, sharp],
  );

  const navigation = useRootNavigation();
  const theme = useTheme();
  function handleOnPressCover() {
    if (manga != null)
      navigation.navigate('MangaView', mangaSchemaToManga(manga));
  }

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  const styledError = React.useMemo(
    () => [
      mangaHistoryItemStyles.error,
      styles.cover,
      { opacity: opacity.value },
    ],
    [styles.cover, mangaHistoryItemStyles.error],
  );
  const fastImageStyle = React.useMemo(
    () => [styles.cover, { backgroundColor: theme.palette.skeleton }],
    [theme.palette.skeleton, styles.cover],
  );
  return (
    <Pressable onPress={handleOnPressCover}>
      {source.uri != null && (
        <Image
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onError={onError}
          source={source}
          style={fastImageStyle}
          resizeMode="cover"
        />
      )}
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
    </Pressable>
  );
};

export default StaticCover;
