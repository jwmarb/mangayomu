import useIsDarkMode from '@/hooks/useIsDarkMode';

// Converts any boolean expression to a number...
function toInt(b: unknown) {
  return b ? 1 : 0;
}

/**
 * Themed props with the proper theme applied to it
 * @param themedProps Props that have been themed
 * @param isContrast Determines whether the props should use an opposite theme
 * @returns Returns props with the theme applied to it
 */
export default function useThemedProps<T>(
  themedProps: readonly [T, T],
  isContrast = false,
) {
  const isDarkTheme = useIsDarkMode();
  return themedProps[isContrast ? toInt(!isDarkTheme) : toInt(isDarkTheme)];
}
