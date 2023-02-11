import { bookDimensions } from '@components/Book';
import Box from '@components/Box';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import useMangaSource from '@hooks/useMangaSource';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { CoverProps } from './Cover.interfaces';

export const coverStyles = ScaledSheet.create({
  image: {
    width: '110@ms',
    height: '160@ms',
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
  const { cover, scale = 1 } = props;
  const opacity = useSharedValue(0);
  const theme = useTheme();
  const imageStyle = React.useMemo(
    () => ({
      width: moderateScale(110 * scale),
      height: moderateScale(160 * scale),
      borderRadius: moderateScale(8 * scale),
    }),
    [scale],
  );
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
      <Box style={loadingStyle}>
        <Progress />
      </Box>
      <Animated.View style={style}>
        <FastImage
          source={require('@assets/No-Image-Placeholder.png')}
          style={combinedStyles}
        />
      </Animated.View>
      <FastImage
        source={{ uri: typeof cover === 'string' ? cover : cover?.imageCover }}
        style={imageStyle}
        onError={handleOnError}
      />
    </>
  );
};

export default Cover;
