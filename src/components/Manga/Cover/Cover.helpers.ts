import { Dimensions } from 'react-native';
import { useTheme } from 'styled-components/native';
import * as ScreenOrientation from 'expo-screen-orientation';

let store: any | null;
export function injectStore(_store: any) {
  store = _store;
}

export function calculateCoverWidth(cols: number): number {
  let width: number;
  switch (store.getState().settings.deviceOrientation) {
    case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
    case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
      width = Dimensions.get('window').height;
      break;
    default:
      width = Dimensions.get('window').width;
  }

  return cols * 0.002 * 13 * width;
}

export function calculateCoverHeight(cols: number): number {
  let width: number;
  switch (store.getState().settings.deviceOrientation) {
    case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
    case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
      width = Dimensions.get('window').height;
      break;
    default:
      width = Dimensions.get('window').width;
  }

  return cols * 0.002 * 20 * width;
}
