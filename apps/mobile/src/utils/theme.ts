/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from '../providers/theme';
import { Theme } from '@mangayomu/theme';

export function createStyles<
  T extends StyleSheet.NamedStyles<any> | StyleSheet.NamedStyles<T>,
>(styles: (theme: Theme) => T) {
  return [
    StyleSheet.create(styles(lightTheme)),
    StyleSheet.create(styles(darkTheme)),
  ] as const;
}
