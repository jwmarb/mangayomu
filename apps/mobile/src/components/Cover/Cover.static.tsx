import { BOOK_DIMENSIONS } from '@theme/constants';
import { AnimatedBox } from '@components/Box';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import useRootNavigation from '@hooks/useRootNavigation';
import { Manga } from '@mangayomu/mangascraper/src';
import { AUTO_HEIGHT_SCALAR } from '@redux/slices/settings';
import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { MangaSchema } from '@database/schemas/Manga';
import mangaSchemaToManga from '@helpers/mangaSchemaToManga';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import useBoolean from '@hooks/useBoolean';
import {
  ImageResolverListener,
  queue,
  unqueue,
} from '@redux/slices/imageresolver';
import { useAppDispatch } from '@redux/main';

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
  manga: Manga | MangaSchema | LocalMangaSchema;
  scale?: number;
  sharp?: boolean;
}

const StaticCover: React.FC<StaticCoverProps> = (props) => {
  const { manga, scale = 1, sharp = false } = props;
  const dispatch = useAppDispatch();
  const [imgSrc, setImgSrc] = React.useState<string | null>(manga.imageCover);
  const [error, toggleError] = useBoolean();
  const prevImgSrc = React.useRef<string | undefined | null>(manga.imageCover);
  if (prevImgSrc.current !== manga.imageCover) {
    prevImgSrc.current = manga.imageCover;
    setImgSrc(manga.imageCover);
  }
  const resolveImage = (manga: Manga, listener?: ImageResolverListener) => {
    dispatch(queue({ manga, listener }));
    return () => dispatch(unqueue({ manga, listener }));
  };
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
  const loadingOpacity = useSharedValue(0);
  const opacity = useSharedValue(0);
  const navigation = useRootNavigation();
  const theme = useTheme();
  function handleOnPressCover() {
    if (manga != null)
      navigation.navigate('MangaView', mangaSchemaToManga(manga));
  }

  function handleOnLoadStart() {
    loadingOpacity.value = 1;
    opacity.value = 0;
  }

  function handleOnLoad() {
    loadingOpacity.value = 0;
    opacity.value = 0;
  }
  function handleOnError() {
    if (!error) toggleError(true);
    else {
      // This is run if refetched image fails to load (error will have already been set to true)
      loadingOpacity.value = 1;
      opacity.value = 1;
    }
  }

  React.useEffect(() => {
    if (error && imgSrc != null) {
      const unqueue = resolveImage(
        'link' in manga
          ? manga
          : {
              link: manga._id,
              imageCover: manga.imageCover,
              source: manga.source,
              title: manga.title,
            },
        (r) => {
          setImgSrc(r);
        },
      );
      return () => {
        unqueue();
      };
    }
  }, [error]);

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
      {imgSrc != null && (
        <Image
          onLoadStart={handleOnLoadStart}
          onLoad={handleOnLoad}
          onError={handleOnError}
          source={{ uri: imgSrc }}
          style={fastImageStyle}
          resizeMode={FastImage.resizeMode.cover}
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
