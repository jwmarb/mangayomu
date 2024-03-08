import useIsDarkMode from '@/hooks/useIsDarkMode';

// Converts any boolean expression to a number...
function toInt(b: unknown) {
  return b ? 1 : 0;
}

/**
 * Uses styles for the proper appearance mode
 * @param themedStyles Styles created from `createStyles`
 * @param isContrast Use the opposite theme instead
 * @returns Returns the correct themed styles
 */
export default function useStyles<T>(
  themedStyles: readonly [T, T],
  isContrast?: boolean,
): T {
  const isDarkMode = useIsDarkMode();
  return themedStyles[isContrast ? toInt(!isDarkMode) : toInt(isDarkMode)];
}
