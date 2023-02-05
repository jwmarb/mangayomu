import Badge from '@components/Badge';
import Box from '@components/Box';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import displayMessage from '@helpers/displayMessage';
import vibrate from '@helpers/vibrate';
import useMangaSource from '@hooks/useMangaSource';
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
const styles = ScaledSheet.create({
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
    backgroundColor: 'gray',
  },
  placeholderText: {
    opacity: 0,
  },
});

const Book: React.FC<BookProps> = (props) => {
  const { manga } = props;
  const source = useMangaSource(manga);
  const opacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (isFocused) {
      overlayOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.ease }),
          withTiming(0.5, { duration: 1000, easing: Easing.ease }),
        ),
        -1,
      );
      return () => {
        cancelAnimation(overlayOpacity);
      };
    }
  }, [isFocused]);
  function handleOnPress() {
    // todo: onPress functionality
  }
  function handleOnLongPress() {
    displayMessage(manga.title);
    vibrate();
  }
  function handleOnError() {
    opacity.value = 1;
  }
  function handleOnLoadEnd() {
    cancelAnimation(overlayOpacity);
    overlayOpacity.value = withTiming(0, {
      duration: 1000,
      easing: Easing.ease,
    });
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const imageOverlay = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'gray',
    opacity: overlayOpacity.value,
  }));
  const overlayStyles = React.useMemo(
    () => [imageOverlay, styles.image],
    [imageOverlay, styles.image],
  );
  return (
    <BaseButton
      style={styles.button}
      onPress={handleOnPress}
      onLongPress={handleOnLongPress}
    >
      <Stack space="s" maxWidth={moderateScale(110)}>
        <Badge type="image" uri={source.getIcon()} show>
          <Animated.View style={overlayStyles} />
          <Animated.View style={style}>
            <FastImage
              source={require('@assets/No-Image-Placeholder.png')}
              style={[styles.image, styles.imageOverlay]}
            />
          </Animated.View>
          <FastImage
            source={{ uri: manga.imageCover }}
            style={styles.image}
            onError={handleOnError}
            onLoadEnd={handleOnLoadEnd}
          />
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
    backgroundColor: 'gray',
    opacity: opacity.value,
  }));
  const textLoading = useAnimatedStyle(() => ({
    backgroundColor: 'gray',
    opacity: opacity.value,
    width: '100%',
    borderRadius: theme.style.borderRadius,
  }));
  const loadingStyles = React.useMemo(
    () => [loading, styles.image],
    [loading, styles.image],
  );
  return (
    <Stack space="s" maxWidth={moderateScale(110)}>
      <Animated.View style={loadingStyles} />
      <Box>
        <Animated.View style={textLoading}>
          <Text
            variant="book-title"
            numberOfLines={2}
            bold
            style={styles.placeholderText}
          >
            a
          </Text>
        </Animated.View>
        <Animated.View style={textLoading}>
          <Text
            variant="book-title"
            numberOfLines={2}
            bold
            style={styles.placeholderText}
          >
            a
          </Text>
        </Animated.View>
      </Box>
    </Stack>
  );
});

export default React.memo(Book);
