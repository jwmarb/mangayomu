import React from 'react';
import { ThemeDarkModeContext } from '../providers/theme';

/**
 * A hook that determines if app is in dark mode
 * @returns Returns a boolean indicating whether dark mode is in use or not
 */
export default function useIsDarkMode() {
  const context = React.useContext(ThemeDarkModeContext);
  return context;
}
