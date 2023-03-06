import Badge from '@components/Badge';
import { CustomizableBookProps } from '@components/Book/Book.interfaces';
import { CustomizableCover } from '@components/Cover/';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import useMangaSource from '@hooks/useMangaSource';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';

const AnimatedStack = Animated.createAnimatedComponent(Stack);

export const BOOK_COVER_RATIO = moderateScale(160) / moderateScale(205);

const AnimatedText = Animated.createAnimatedComponent(Text);

const CustomizableBook: React.FC<CustomizableBookProps> = (props) => {
  const {
    width,
    height,
    source: mangaSource,
    title,
    imageCover,
    bold,
    fontSize,
    letterSpacing,
    align,
    bookStyle,
  } = props;
  const source = useMangaSource(mangaSource);
  const theme = useTheme();

  const coverHeight = useDerivedValue(() => height.value * BOOK_COVER_RATIO);

  const stackStyle = useAnimatedStyle(() => ({
    width: width.value,
    minHeight: height.value,
  }));

  const fontStyle = useAnimatedStyle(() => ({
    fontSize: fontSize.value,
    letterSpacing: letterSpacing.value,
  }));

  const textContainerStyle = useAnimatedStyle(() => ({
    position: bookStyle === BookStyle.TACHIYOMI ? 'absolute' : 'relative',
    zIndex: 10000,
  }));

  return (
    <AnimatedStack space="s" style={stackStyle}>
      <Badge type="image" uri={source.getIcon()} show>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.8)', theme.palette.background.default]}
        >
          <CustomizableCover
            bookStyle={bookStyle}
            bookHeight={height}
            width={width}
            height={coverHeight}
            src={imageCover}
          />
        </LinearGradient>
      </Badge>
      <Animated.View style={textContainerStyle}>
        <AnimatedText
          style={fontStyle}
          numberOfLines={2}
          bold={bold}
          align={align}
        >
          {title}
        </AnimatedText>
      </Animated.View>
    </AnimatedStack>
  );
};

export default CustomizableBook;
