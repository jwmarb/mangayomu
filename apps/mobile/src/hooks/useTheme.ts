import { lightTheme, darkTheme } from '../providers/theme';
import useIsDarkMode from './useIsDarkMode';

/**
 * Uses the theme object generated from the device's theme
 * @param isContrast Whether to use the opposite theme of this device's current theme
 * @returns Returns the theme object
 */
export default function useTheme(isContrast?: boolean) {
  const isDarkTheme = useIsDarkMode();
  return (isContrast ? isDarkTheme : !isDarkTheme) ? darkTheme : lightTheme;
}
