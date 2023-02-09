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
import { ScaledSheet } from 'react-native-size-matters';
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
const combinedStyles = [coverStyles.image, coverStyles.imageOverlay];

const Cover: React.FC<CoverProps> = (props) => {
  const { cover } = props;
  const opacity = useSharedValue(0);
  const theme = useTheme();

  function handleOnError() {
    opacity.value = 1;
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const loadingStyle = React.useMemo(
    () => [combinedStyles, { backgroundColor: theme.palette.skeleton }],
    [coverStyles.image, theme.palette.skeleton, coverStyles.imageOverlay],
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
        style={coverStyles.image}
        onError={handleOnError}
      />
    </>
  );
};

export default Cover;
