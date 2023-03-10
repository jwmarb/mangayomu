import Box from '@components/Box';
import { coverStyles } from '@components/Cover/Cover';
import Stack from '@components/Stack';
import { useIsFocused } from '@react-navigation/native';
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
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { BookStyle } from '@redux/slices/settings';

const mapStateToProps = (state: AppState) => state.settings.book;

const connector = connect(mapStateToProps);
type LoadingBookProps = ConnectedProps<typeof connector>;

const LoadingBook: React.FC<LoadingBookProps> = ({
  width,
  height,
  coverHeight,
  title,
  style,
}) => {
  const opacity = useSharedValue(0.5);
  const isFocused = useIsFocused();
  const theme = useTheme();
  const textStyle = React.useMemo(
    () => [
      { fontSize: title.size, letterSpacing: title.letterSpacing },
      coverStyles.placeholderText,
    ],
    [title.size, title.letterSpacing],
  );

  React.useEffect(() => {
    if (isFocused) {
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
    }
  }, [isFocused]);
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
    <Stack space="s" width={width} minHeight={height}>
      <Animated.View style={loadingStyles} />
      {style !== BookStyle.TACHIYOMI && (
        <Box>
          <Animated.View style={textLoading}>
            <Text
              numberOfLines={2}
              bold={title.bold}
              align={title.alignment}
              style={textStyle}
            >
              a
            </Text>
          </Animated.View>
          <Animated.View style={textLoading}>
            <Text
              numberOfLines={2}
              bold={title.bold}
              align={title.alignment}
              style={textStyle}
            >
              a
            </Text>
          </Animated.View>
        </Box>
      )}
    </Stack>
  );
};

export default connector(React.memo(LoadingBook));
