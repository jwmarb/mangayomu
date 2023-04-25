import { AnimatedBox } from '@components/Box';
import connector, { ConnectedCoverProps } from '@components/Cover/Cover.redux';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
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
    scale = 1,
    coverHeight,
    width,
    bookHeight,
    coverStyle,
    children,
  } = props;
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
      borderWidth: coverStyle === BookStyle.TACHIYOMI ? 1 : 0,
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

  function handleOnError() {
    opacity.value = 1;
  }

  function handleOnLoadStart() {
    loadingOpacity.value = 1;
  }

  function handleOnLoadEnd() {
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

  return (
    <>
      <AnimatedBox style={combinedLoadingStyle}>
        <Progress />
      </AnimatedBox>
      <Animated.View style={style}>
        <FastImage
          source={require('@assets/No-Image-Placeholder.png')}
          style={combinedStyles}
        >
          {children}
        </FastImage>
      </Animated.View>
      <FastImage
        source={{ uri: typeof cover === 'string' ? cover : cover?.imageCover }}
        onLoadStart={handleOnLoadStart}
        onLoadEnd={handleOnLoadEnd}
        style={imageStyle}
        onError={handleOnError}
      >
        {children}
      </FastImage>
    </>
  );
};

export default connector(Cover);
