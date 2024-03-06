/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet } from 'react-native';
import { Theme } from '@mangayomu/theme';
import { lightTheme, darkTheme } from '@/providers/theme';

/**
 * Same as `StyleSheet.create` except the theme can be passed into it to create theme-dependent styles
 * @param styles A callback function with the theme passed as an argument that returns styles
 * @returns Returns an array with a light and dark theme styles
 */
export function createStyles<
  T extends StyleSheet.NamedStyles<any> | StyleSheet.NamedStyles<T>,
>(styles: (theme: Theme) => T) {
  return [
    StyleSheet.create(styles(lightTheme)),
    StyleSheet.create(styles(darkTheme)),
  ] as const;
}

/**
 * Creates props with a theme imbued with it
 * @param withProps A callback function with the theme passed as an argument that returns props
 * @returns Returns an array with a light theme and a dark theme props.
 */
export function createThemedProps<T>(withProps: (theme: Theme) => T) {
  return [withProps(lightTheme), withProps(darkTheme)] as const;
}
