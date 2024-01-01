import { coverStyles } from '@components/Cover/Cover';
import { CustomizableCoverProps } from './';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import Box from '@components/Box';
import { AnimatedImprovedImage } from '@components/ImprovedImage';

const borderRadius = moderateScale(8);

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
        <Animated.Image
          source={require('@assets/No-Image-Placeholder.png')}
          style={combinedStyles}
        />
        <Box position="absolute" left={0} right={0} top={0} bottom={0}>
          {children}
        </Box>
      </Animated.View>
      <AnimatedImprovedImage // ImprovedImage
        source={{ uri: src }}
        resizeMode="cover"
        style={imageStyle}
        onError={handleOnError}
      />
      <Box position="absolute" left={0} right={0} top={0} bottom={0}>
        {children}
      </Box>
    </>
  );
};

export default CustomizableCover;
