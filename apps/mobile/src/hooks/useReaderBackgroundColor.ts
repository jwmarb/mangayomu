import { useTheme } from '@emotion/react';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import React from 'react';

/**
 * Use the reader background color
 * @param backgroundColor The background color provided by the user
 * @returns Returns variables for UI depending on the user background color
 */
export default function useReaderBackgroundColor(
  backgroundColor: ReaderBackgroundColor,
) {
  const theme = useTheme();
  const textPrimary = React.useMemo(() => {
    switch (backgroundColor) {
      case ReaderBackgroundColor.BLACK:
        return { custom: theme.helpers.getContrastText('#000000') };
      case ReaderBackgroundColor.WHITE:
        return { custom: theme.helpers.getContrastText('rgb(255, 255, 255)') };
      case ReaderBackgroundColor.GRAY:
        return { custom: theme.helpers.getContrastText('rgb(128,128,128)') };
    }
  }, [backgroundColor, theme]);
  const textSecondary = React.useMemo(() => {
    switch (backgroundColor) {
      case ReaderBackgroundColor.BLACK:
        return { custom: 'rgba(255, 255, 255, 0.7)' };
      case ReaderBackgroundColor.GRAY:
      case ReaderBackgroundColor.WHITE:
        return { custom: 'rgba(0, 0, 0, 0.6)' };
    }
  }, [backgroundColor]);
  return {
    background: backgroundColor.toLowerCase(),
    textPrimary,
    textSecondary,
  };
}
