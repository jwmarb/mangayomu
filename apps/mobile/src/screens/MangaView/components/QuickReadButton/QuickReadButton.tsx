import React from 'react';
import { QuickReadButtonProps } from './QuickReadButton.interfaces';
import { useIsFocused } from '@react-navigation/native';
import Box, { AnimatedBox } from '@components/Box';
import { moderateScale } from 'react-native-size-matters';
import { StyleSheet, TouchableNativeFeedback } from 'react-native';
import { useTheme } from '@emotion/react';
import Stack, { AnimatedStack } from '@components/Stack';
import Icon from '@components/Icon';
import Text from '@components/Text';
import Animated, {
  FadeInDown,
  FadeOutDown,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import displayMessage from '@helpers/displayMessage';
import { useLocalRealm, useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import useRootNavigation from '@hooks/useRootNavigation';
import { MangaSchema } from '@database/schemas/Manga';

const INTERPOLATION_VALUE = [moderateScale(64), moderateScale(128)];
const styles = StyleSheet.create({
  icon: {
    transform: [{ rotate: '90deg' }],
  },
});

const QuickReadButton: React.FC<QuickReadButtonProps> = (props) => {
  const {
    mangaKey,
    currentlyReadingChapter,
    networkStatusOffset,
    textOpacity,
    firstChapter,
  } = props;
  const navigation = useRootNavigation();
  const isFocused = useIsFocused();
  const theme = useTheme();
  const localRealm = useLocalRealm();
  const handleOnLongPress = () => {
    if (currentlyReadingChapter != null) {
      const chapter = localRealm.objectForPrimaryKey(
        ChapterSchema,
        currentlyReadingChapter._id,
      );
      if (chapter != null) displayMessage(chapter?.name);
    }
  };
  const handleOnPress = () => {
    if (mangaKey) {
      if (currentlyReadingChapter)
        navigation.navigate('Reader', {
          chapter: currentlyReadingChapter._id,
          manga: mangaKey,
        });
      else if (firstChapter != null)
        navigation.navigate('Reader', {
          chapter: firstChapter._id,
          manga: mangaKey,
        });
    }
  };
  const floatingActionButtonStyle = useAnimatedStyle(() => ({
    bottom: networkStatusOffset.value,
  }));
  const containerStyle = useAnimatedStyle(() => ({
    width: interpolate(textOpacity.value, [0, 1], INTERPOLATION_VALUE),
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  if (isFocused && mangaKey != null)
    return (
      <AnimatedBox
        entering={FadeInDown}
        exiting={FadeOutDown}
        box-shadow
        border-radius={1000}
        position="absolute"
        style={floatingActionButtonStyle}
        right={moderateScale(16)}
        overflow="hidden"
      >
        <TouchableNativeFeedback
          useForeground
          background={TouchableNativeFeedback.Ripple(
            theme.palette.primary.ripple,
            false,
          )}
          onPress={handleOnPress}
          onLongPress={handleOnLongPress}
        >
          <Box
            background-color="primary"
            border-radius={1000}
            height={moderateScale(64)}
            justify-content="center"
          >
            <AnimatedStack flex-direction="row" style={containerStyle} px="l">
              <Icon
                type="font"
                name="triangle"
                color="primary@contrast"
                size={moderateScale(16)}
                style={styles.icon}
              />
              <Box ml="m">
                <Text
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  as={Animated.Text}
                  style={textStyle}
                  variant="button"
                  bold
                  color="primary@contrast"
                >
                  Resume
                </Text>
              </Box>
            </AnimatedStack>
          </Box>
        </TouchableNativeFeedback>
      </AnimatedBox>
    );
  return null;
};

export default React.memo(QuickReadButton);