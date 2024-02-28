import { useTheme } from '@emotion/react';
import useAppSelector from '@hooks/useAppSelector';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const colors = ['transparent', 'rgba(0, 0, 0, 0.5)'];
const start = { x: 0, y: 0 };
const end = { x: 0, y: 1 };
const styles = StyleSheet.create({
  linearGradient: {
    flexGrow: 1,
    flexDirection: 'column-reverse',
  },
});

export default function CoverLayoutStyle(props: React.PropsWithChildren) {
  const { children } = props;
  const theme = useTheme();
  const paddingHorizontal = useAppSelector(
    (state) => state.settings.book.paddingHorizontal,
  );
  const bookStyle = useAppSelector((state) => state.settings.book.style);
  const linearGradientStyle = [
    {
      paddingHorizontal,
      paddingBottom: theme.style.spacing.s,
    },
    styles.linearGradient,
  ];

  if (bookStyle !== BookStyle.TACHIYOMI) return <>{children}</>;

  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={linearGradientStyle}
    >
      {children}
    </LinearGradient>
  );
}
