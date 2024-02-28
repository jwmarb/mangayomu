import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  moderateScale,
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters';
export const NAVHEADER_HEIGHT = moderateScale(90);
export const useNavStyles = () => {
  const insets = useSafeAreaInsets();
  return {
    header: {
      height: moderateScale(90),
      paddingTop: insets.top,
      justifyContent: 'center',
    },
    offset: {
      paddingTop: moderateScale(90),
    },
    contentContainerStyle: {
      paddingBottom: verticalScale(150),
    },
  } as const;
};
/**
 * @deprecated
 */
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
export { default as TabHeader } from './TabHeader';
