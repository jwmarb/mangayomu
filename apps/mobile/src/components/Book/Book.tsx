import Badge from '@components/Badge';
import Box from '@components/Box';
import Cover from '@components/Cover';
import { coverStyles } from '@components/Cover/Cover';
import Progress from '@components/Progress';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import displayMessage from '@helpers/displayMessage';
import vibrate from '@helpers/vibrate';
import useMangaSource from '@hooks/useMangaSource';
import useRootNavigation from '@hooks/useRootNavigation';
import { MangaHost } from '@mangayomu/mangascraper';
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { BaseButton } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { BookProps } from './Book.interfaces';

export const bookDimensions = {
  width: moderateScale(110),
  height: moderateScale(205),
};

const Book: React.FC<BookProps> = (props) => {
  const { manga } = props;
  const navigation = useRootNavigation();
  const source = useMangaSource(manga);

  function handleOnPress() {
    navigation.navigate('MangaView', manga);
  }
  function handleOnLongPress() {
    displayMessage(manga.title);
    vibrate();
  }
  const theme = useTheme();

  return (
    <BaseButton
      style={coverStyles.button}
      onPress={handleOnPress}
      onLongPress={handleOnLongPress}
      rippleColor={theme.palette.action.ripple}
    >
      <Stack
        space="s"
        width={bookDimensions.width}
        height={bookDimensions.height}
      >
        <Badge type="image" uri={source.getIcon()} show>
          <Cover cover={manga} />
        </Badge>
        <Text variant="book-title" numberOfLines={2} bold>
          {manga.title}
        </Text>
      </Stack>
    </BaseButton>
  );
};

export const LoadingBook = React.memo(() => {
  const opacity = useSharedValue(0.5);
  const isFocused = useIsFocused();
  const theme = useTheme();
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
        width: '100%',
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
      coverStyles.image,
      { backgroundColor: theme.palette.skeleton },
    ],
    [loading, coverStyles.image, theme.palette.skeleton],
  );
  return (
    <Stack
      space="s"
      width={bookDimensions.width}
      height={bookDimensions.height}
    >
      <Animated.View style={loadingStyles} />
      <Box>
        <Animated.View style={textLoading}>
          <Text
            variant="book-title"
            numberOfLines={2}
            bold
            style={coverStyles.placeholderText}
          >
            a
          </Text>
        </Animated.View>
        <Animated.View style={textLoading}>
          <Text
            variant="book-title"
            numberOfLines={2}
            bold
            style={coverStyles.placeholderText}
          >
            a
          </Text>
        </Animated.View>
      </Box>
    </Stack>
  );
});

export default React.memo(Book);
