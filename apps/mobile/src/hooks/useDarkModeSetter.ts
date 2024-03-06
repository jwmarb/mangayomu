import React from 'react';
import { ThemeSetDarkModeContext } from '@/providers/theme';

/**
 * A hook that gets the setter for isDarkMode
 * @returns Returns a setter for modifying isDarkMode
 */
export default function useDarkModeSetter() {
  const context = React.useContext(ThemeSetDarkModeContext);
  if (context == null)
    throw new Error(
      'Tried to consume `ThemeDarkModeContext` when component is not a child of it',
    );

  return context;
}
