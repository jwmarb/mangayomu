import { RFValue } from 'react-native-responsive-fontsize';

/**
 * Converts hard-coded pixels to responsive pixels. This is basically the "rem" unit for react-native. Credits to heyman333
 * @param unit pixels
 * @returns Returns the amount of pixels after calculating responsive layout
 */
export function rem(pixels: number) {
  return RFValue(pixels) + 'px';
}
