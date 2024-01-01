import Box, { AnimatedBox } from '@components/Box';
import { CoverProps } from '@components/Cover';
import useImageHandler from '@components/Cover/useImageHandler';
import ImprovedImage from '@components/ImprovedImage';
import Progress from '@components/Progress';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import useAppSelector from '@hooks/useAppSelector';
import { BookStyle } from '@redux/slices/settings';
import { BOOK_COVER_HEIGHT, BOOK_DIMENSIONS } from '@theme/constants';
import React from 'react';
import { Image } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
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

const Cover: React.FC<CoverProps> = (props) => {
  const { scale = 1, normalBookDimensions, children } = props;
  const bookHeight = useAppSelector((state) => state.settings.book.height);
  const coverStyle = useAppSelector((state) => state.settings.book.style);
  const coverHeight = useAppSelector((state) =>
    normalBookDimensions ? BOOK_COVER_HEIGHT : state.settings.book.coverHeight,
  );
  const width = useAppSelector((state) =>
    normalBookDimensions ? BOOK_DIMENSIONS.width : state.settings.book.width,
  );

  const {
    source,
    onLoad,
    onLoadStart,
    onError,
    opacity,
    loadingOpacity,
    error,
  } = useImageHandler(props);
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

  return (
    <>
      <AnimatedBox style={combinedLoadingStyle}>
        <Progress />
      </AnimatedBox>

      <Animated.Image
        source={require('@assets/No-Image-Placeholder.png')}
        style={[
          imageStyle,
          style,
          { position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 },
        ]}
      />
      <ImprovedImage // ImprovedImage
        progressiveRenderingEnabled
        source={source}
        onLoadStart={onLoadStart}
        onLoad={onLoad}
        style={imageStyle}
        onError={onError}
      />
      {React.Children.count(children) > 0 && (
        <Box position="absolute" left={0} right={0} top={0} bottom={0}>
          {children}
        </Box>
      )}
    </>
  );
};

export default Cover;
