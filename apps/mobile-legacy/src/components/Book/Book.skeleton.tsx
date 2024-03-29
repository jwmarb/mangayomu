import Box, { AnimatedBox } from '@components/Box';
import { coverStyles } from '@components/Cover/Cover';
import Stack from '@components/Stack';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@emotion/react';
import React from 'react';
import Text from '@components/Text';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { BookStyle } from '@redux/slices/settings';
import useAppSelector from '@hooks/useAppSelector';

const LoadingBook: React.FC = () => {
  const { width, height, coverHeight, title, style } = useAppSelector(
    (state) => state.settings.book,
  );
  const opacity = useSharedValue(0.5);
  const theme = useTheme();
  const textStyle = React.useMemo(
    () => [
      { fontSize: title.size, letterSpacing: title.letterSpacing },
      coverStyles.placeholderText,
    ],
    [title.size, title.letterSpacing],
  );

  useFocusEffect(
    React.useCallback(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.ease }),
          withTiming(0.5, { duration: 1000, easing: Easing.ease }),
        ),
        -1,
      );
      return () => {
        cancelAnimation(opacity);
      };
    }, []),
  );
  const loading = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const textLoading = React.useMemo(
    () => [
      {
        width,
        borderRadius: theme.style.borderRadius,
        backgroundColor: theme.palette.skeleton,
      },
      loading,
    ],
    [loading, theme.palette.skeleton],
  );
  const loadingStyles = React.useMemo(
    () => [
      loading,
      style === BookStyle.MANGAROCK ? { borderRadius: 0 } : coverStyles.image,
      {
        backgroundColor: theme.palette.skeleton,
        width,
        height: style === BookStyle.TACHIYOMI ? height : coverHeight,
      },
    ],
    [loading, coverStyles.image, theme.palette.skeleton, style],
  );
  return (
    <Stack space="s" width={width} minHeight={height} align-self="center">
      <Animated.View style={loadingStyles} />
      {style !== BookStyle.TACHIYOMI && (
        <Box>
          <Box>
            <Text
              numberOfLines={2}
              bold={title.bold}
              align={title.alignment}
              style={textStyle}
            >
              a
            </Text>
            <Box
              flex-grow
              position="absolute"
              left={0}
              right={0}
              top={0}
              bottom={0}
              align-items="center"
              justify-content="center"
            >
              <AnimatedBox height="50%" style={textLoading} />
            </Box>
          </Box>
          <Box>
            <Text
              numberOfLines={2}
              bold={title.bold}
              align={title.alignment}
              style={textStyle}
            >
              a
            </Text>
            <Box
              flex-grow
              position="absolute"
              left={0}
              right={0}
              top={0}
              bottom={0}
              align-items="center"
              justify-content="center"
            >
              <AnimatedBox height="50%" style={textLoading} />
            </Box>
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export default React.memo(LoadingBook);
