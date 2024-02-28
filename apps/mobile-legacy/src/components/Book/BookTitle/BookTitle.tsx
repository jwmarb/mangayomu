import Text from '@components/Text';
import useAppSelector from '@hooks/useAppSelector';
import { ViewStyle } from 'react-native';
import type { BookTitleProps } from './';
import { useTheme } from '@emotion/react';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';

export default function BookTitle(
  props: React.PropsWithChildren<BookTitleProps>,
) {
  const bookStyle = useAppSelector((state) => state.settings.book.style);
  const theme = useTheme();
  const fontSize = useAppSelector((state) => state.settings.book.title.size);
  const letterSpacing = useAppSelector(
    (state) => state.settings.book.title.letterSpacing,
  );
  const bold = useAppSelector((state) => state.settings.book.title.bold);
  const align = useAppSelector((state) => state.settings.book.title.alignment);
  const textStyle = { fontSize, letterSpacing } as ViewStyle;
  const color = React.useMemo(
    () =>
      bookStyle === BookStyle.TACHIYOMI
        ? theme.helpers.getContrastText('#000000')
        : undefined,
    [bookStyle],
  );

  return (
    <Text
      style={textStyle}
      numberOfLines={2}
      bold={bold}
      align={align}
      color={color}
    >
      {props.title}
    </Text>
  );
}
