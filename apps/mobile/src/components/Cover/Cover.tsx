import { AnimatedBox } from '@components/Box';
import connector, { ConnectedCoverProps } from '@components/Cover/Cover.redux';
import useImageHandler from '@components/Cover/useImageHandler';
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
    scale = 1,
    coverHeight,
    width,
    bookHeight,
    coverStyle,
    children,
  } = props;

  const { source, onLoad, onLoadStart, onError, opacity, loadingOpacity } =
    useImageHandler(props);
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
      {source.uri != null && (
        <FastImage
          source={source}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          style={imageStyle}
          onError={onError}
        >
          {children}
        </FastImage>
      )}
    </>
  );
};

export default connector(Cover);
