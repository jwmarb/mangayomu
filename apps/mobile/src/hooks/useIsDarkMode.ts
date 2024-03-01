import React from 'react';
import { ThemeDarkModeContext } from '../providers/theme';

/**
 * A hook that allows access to the theme object
 * @returns Returns a `Theme` object
 */
export default function useIsDarkMode() {
  const context = React.useContext(ThemeDarkModeContext);
  return context;
}
