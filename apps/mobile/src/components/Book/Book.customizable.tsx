import Badge from '@components/Badge';
import { CustomizableBookProps } from '@components/Book/Book.interfaces';
import Box from '@components/Box';
import { CustomizableCover } from '@components/Cover/';
import * as AnimatedPlus from '@components/AnimatedPlus';
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
import { moderateScale, ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  linearGradient: {
    flexGrow: 1,
    flexDirection: 'column-reverse',
  },
});

export const BOOK_COVER_RATIO = moderateScale(160) / moderateScale(205);

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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
  const linearGradientPadding = useDerivedValue(() =>
    Math.max(theme.style.spacing.s, height.value * 0.025),
  );

  const stackStyle = useAnimatedStyle(() => ({
    width: width.value,
    minHeight: height.value,
  }));

  const fontStyle = useAnimatedStyle(() => ({
    fontSize: fontSize.value,
    letterSpacing: letterSpacing.value,
  }));

  const linearGradientStyle = useAnimatedStyle(() => ({
    paddingHorizontal: linearGradientPadding.value,
  }));

  const combinedLinearGradientStyle = React.useMemo(
    () => [
      linearGradientStyle,
      styles.linearGradient,
      { paddingBottom: theme.style.spacing.s },
    ],
    [linearGradientStyle, theme.style.spacing.s, styles.linearGradient],
  );

  if (bookStyle === BookStyle.TACHIYOMI)
    return (
      <AnimatedPlus.Stack space="s" style={stackStyle}>
        <Badge type="image" uri={source.getIcon()} show>
          <CustomizableCover
            bookStyle={bookStyle}
            bookHeight={height}
            width={width}
            height={height}
            src={imageCover}
          >
            <AnimatedLinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={combinedLinearGradientStyle}
            >
              <AnimatedPlus.Text
                style={fontStyle}
                numberOfLines={2}
                bold={bold}
                align={align}
              >
                {title}
              </AnimatedPlus.Text>
            </AnimatedLinearGradient>
          </CustomizableCover>
        </Badge>
      </AnimatedPlus.Stack>
    );

  return (
    <AnimatedPlus.Stack space="s" style={stackStyle}>
      <Badge type="image" uri={source.getIcon()} show>
        <CustomizableCover
          bookStyle={bookStyle}
          bookHeight={height}
          width={width}
          height={coverHeight}
          src={imageCover}
        />
      </Badge>
      <AnimatedPlus.Text
        style={fontStyle}
        numberOfLines={2}
        bold={bold}
        align={align}
      >
        {title}
      </AnimatedPlus.Text>
    </AnimatedPlus.Stack>
  );
};

export default CustomizableBook;
