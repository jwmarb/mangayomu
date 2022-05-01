import { Dimensions } from 'react-native';
import { useTheme } from 'styled-components/native';
const { width } = Dimensions.get('window');

export function calculateCoverWidth(cols: number): number {
  return cols * 0.002 * 13 * width;
}

export function calculateCoverHeight(cols: number): number {
  return cols * 0.002 * 20 * width;
}
