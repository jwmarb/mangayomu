import Badge from '@components/Badge';
import { CustomizableBookProps } from '@components/Book/Book.interfaces';
import { CustomizableCover } from '@components/Cover/';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import useMangaSource from '@hooks/useMangaSource';
import React from 'react';
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
  } = props;
  const source = useMangaSource(mangaSource);

  const coverHeight = useDerivedValue(() => height.value * BOOK_COVER_RATIO);

  const stackStyle = useAnimatedStyle(() => ({
    width: width.value,
    minHeight: height.value,
  }));

  const fontStyle = useAnimatedStyle(() => ({
    fontSize: fontSize.value,
    letterSpacing: letterSpacing.value,
  }));

  return (
    <AnimatedStack space="s" style={stackStyle}>
      <Badge type="image" uri={source.getIcon()} show>
        <CustomizableCover
          width={width}
          height={coverHeight}
          src={imageCover}
        />
      </Badge>
      <AnimatedText
        style={fontStyle}
        numberOfLines={2}
        bold={bold}
        align={align}
      >
        {title}
      </AnimatedText>
    </AnimatedStack>
  );
};

export default CustomizableBook;
