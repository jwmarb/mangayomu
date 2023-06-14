import { coverStyles } from '@components/Cover/Cover';
import { CustomizableCoverProps } from '@components/Cover/Cover.interfaces';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';

const borderRadius = moderateScale(8);

const AnimatedFastImage = Animated.createAnimatedComponent(
  FastImage as React.FC<FastImageProps>,
);

const CustomizableCover: React.FC<CustomizableCoverProps> = (props) => {
  const { width, height, src, bookStyle, bookHeight, children } = props;
  const opacity = useSharedValue(0);
  const theme = useTheme();
  const imageStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: bookStyle === BookStyle.TACHIYOMI ? bookHeight.value : height.value,
    borderRadius: bookStyle !== BookStyle.MANGAROCK ? borderRadius : 0,
    borderWidth: bookStyle === BookStyle.TACHIYOMI ? 1 : 0,
    borderColor:
      bookStyle === BookStyle.TACHIYOMI
        ? theme.palette.background.disabled
        : undefined,
  }));

  const combinedStyles = React.useMemo(
    () => [imageStyle, coverStyles.imageOverlay],
    [imageStyle, coverStyles.imageOverlay],
  );

  function handleOnError() {
    opacity.value = 1;
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const loadingStyle = React.useMemo(
    () => [combinedStyles, { backgroundColor: theme.palette.skeleton }],
    [imageStyle, theme.palette.skeleton, coverStyles.imageOverlay],
  );

  return (
    <>
      <Animated.View style={loadingStyle}>
        <Progress />
      </Animated.View>
      <Animated.View style={style}>
        <AnimatedFastImage
          source={require('@assets/No-Image-Placeholder.png')}
          style={combinedStyles}
        >
          {children}
        </AnimatedFastImage>
      </Animated.View>
      <AnimatedFastImage
        source={{ uri: src }}
        resizeMode="cover"
        style={imageStyle}
        onError={handleOnError}
      >
        {children}
      </AnimatedFastImage>
    </>
  );
};

export default CustomizableCover;
