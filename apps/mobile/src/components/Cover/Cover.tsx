import { AnimatedBox } from '@components/Box';
import connector, { ConnectedCoverProps } from '@components/Cover/Cover.redux';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import useBoolean from '@hooks/useBoolean';
import { Manga } from '@mangayomu/mangascraper/src';
import { useAppDispatch } from '@redux/main';
import {
  ImageResolverListener,
  queue,
  unqueue,
} from '@redux/slices/imageresolver';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';

export const coverStyles = ScaledSheet.create({
  image: {
    borderRadius: '8@ms',
  },
  button: {
    borderRadius: '8@ms',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    opacity: 0,
  },
});

const Cover: React.FC<ConnectedCoverProps> = (props) => {
  const {
    cover,
    manga,
    scale = 1,
    coverHeight,
    width,
    bookHeight,
    coverStyle,
    children,
  } = props;
  const dispatch = useAppDispatch();
  const src = typeof cover === 'string' ? cover : cover?.imageCover;
  const [imgSrc, setImgSrc] = React.useState<string | undefined | null>(src);
  const prevImgSrc = React.useRef<string | undefined | null>(src);
  if (prevImgSrc.current !== src) {
    prevImgSrc.current = src;
    setImgSrc(src);
  }
  const [error, toggleError] = useBoolean();
  const resolveImage = (manga: Manga, listener?: ImageResolverListener) => {
    dispatch(queue({ manga, listener }));
    return () => dispatch(unqueue({ manga, listener }));
  };
  const opacity = useSharedValue(0);
  const loadingOpacity = useSharedValue(0);
  const theme = useTheme();
  const imageStyle = React.useMemo(
    () => ({
      width: width * scale,
      height:
        coverStyle === BookStyle.TACHIYOMI
          ? bookHeight * scale
          : coverHeight * scale,
      borderRadius:
        coverStyle !== BookStyle.MANGAROCK ? moderateScale(8 * scale) : 0,
      borderWidth:
        coverStyle === BookStyle.TACHIYOMI ? theme.style.borderWidth : 0,
      borderColor:
        coverStyle === BookStyle.TACHIYOMI
          ? theme.palette.background.disabled
          : undefined,
    }),
    [scale, width, coverHeight, bookHeight, coverStyle],
  );
  const combinedStyles = React.useMemo(
    () => [imageStyle, coverStyles.imageOverlay],
    [imageStyle, coverStyles.imageOverlay],
  );

  React.useEffect(() => {
    if (imgSrc == null) {
      loadingOpacity.value = 0;
      opacity.value = 1;
    } else {
      loadingOpacity.value = 1;
      opacity.value = 0;
    }
  }, [imgSrc]);

  React.useEffect(() => {
    if (error && imgSrc != null) {
      const dequeue = resolveImage(manga, (r) => {
        setImgSrc(r);
      });
      return () => {
        dequeue();
      };
    }
  }, [error]);

  function handleOnError() {
    if (!error) toggleError(true);
    else {
      // This is run if refetched image fails to load (error will have already been set to true)
      loadingOpacity.value = 0;
      opacity.value = 1;
    }
  }

  function handleOnLoadStart() {
    loadingOpacity.value = 1;
  }

  function handleOnLoad() {
    loadingOpacity.value = 0;
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const loadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));
  const combinedLoadingStyle = React.useMemo(
    () => [
      combinedStyles,
      { backgroundColor: theme.palette.skeleton },
      loadingStyle,
    ],
    [imageStyle, theme.palette.skeleton, coverStyles.imageOverlay],
  );
  const imagePlaceHolderStyle = React.useMemo(
    () => [coverStyles.imageOverlay, style],
    [style],
  );

  return (
    <>
      <AnimatedBox style={combinedLoadingStyle}>
        <Progress />
      </AnimatedBox>
      <Animated.View style={imagePlaceHolderStyle}>
        <Image
          source={require('@assets/No-Image-Placeholder.png')}
          style={imageStyle}
        />
      </Animated.View>
      {imgSrc != null && (
        <FastImage
          source={{ uri: imgSrc }}
          onLoadStart={handleOnLoadStart}
          onLoadEnd={handleOnLoad}
          onLoad={handleOnLoad}
          style={imageStyle}
          onError={handleOnError}
        >
          {children}
        </FastImage>
      )}
    </>
  );
};

export default connector(Cover);
