import { StatusBar } from 'react-native';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
export const NAVHEADER_HEIGHT = moderateScale(80);
export const NavStyles = ScaledSheet.create({
  header: {
    height: '90@ms',
    paddingTop: StatusBar.currentHeight ?? 0,
    justifyContent: 'center',
  },
  offset: {
    paddingTop: '90@ms',
  },
  contentContainerStyle: {
    paddingBottom: '150@vs',
  },
});
export { default as StackHeader } from './NavHeader';
export { default as TabHeader } from './TabHeader';
