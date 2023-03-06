import Badge from '@components/Badge';
import connector, { ConnectedBookProps } from '@components/Book/Book.redux';
import Cover from '@components/Cover';
import { coverStyles } from '@components/Cover/Cover';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import displayMessage from '@helpers/displayMessage';
import vibrate from '@helpers/vibrate';
import useMangaSource from '@hooks/useMangaSource';
import useRootNavigation from '@hooks/useRootNavigation';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
import { BaseButton } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';

export const bookDimensions = {
  width: moderateScale(110),
  height: moderateScale(205),
};

const styles = ScaledSheet.create({
  linearGradient: {
    flexGrow: 1,
    flexDirection: 'column-reverse',
  },
});

const Book: React.FC<ConnectedBookProps> = (props) => {
  const {
    manga,
    width,
    height,
    align,
    fontSize,
    bold,
    letterSpacing,
    bookStyle,
    paddingHorizontal,
  } = props;
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

  const textStyle = React.useMemo(
    () => ({ fontSize, letterSpacing }),
    [fontSize, letterSpacing],
  );

  const linearGradientStyle = React.useMemo(
    () => [
      {
        paddingHorizontal,
        paddingBottom: theme.style.spacing.s,
      },
      styles.linearGradient,
    ],
    [styles.linearGradient, theme.style.spacing.s],
  );

  if (bookStyle === BookStyle.TACHIYOMI)
    return (
      <BaseButton
        style={coverStyles.button}
        onPress={handleOnPress}
        onLongPress={handleOnLongPress}
        rippleColor={theme.palette.action.ripple}
      >
        <Stack space="s" width={width} minHeight={height}>
          <Badge type="image" uri={source.getIcon()} show>
            <Cover cover={manga}>
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={linearGradientStyle}
              >
                <Text
                  style={textStyle}
                  numberOfLines={2}
                  bold={bold}
                  align={align}
                >
                  {manga.title}
                </Text>
              </LinearGradient>
            </Cover>
          </Badge>
        </Stack>
      </BaseButton>
    );

  return (
    <BaseButton
      style={coverStyles.button}
      onPress={handleOnPress}
      onLongPress={handleOnLongPress}
      rippleColor={theme.palette.action.ripple}
    >
      <Stack space="s" width={width} minHeight={height}>
        <Badge type="image" uri={source.getIcon()} show>
          <Cover cover={manga} />
        </Badge>
        <Text style={textStyle} numberOfLines={2} bold={bold} align={align}>
          {manga.title}
        </Text>
      </Stack>
    </BaseButton>
  );
};

export default connector(React.memo(Book));
