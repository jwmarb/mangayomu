import React from 'react';
import { CustomBottomSheetProps } from './CustomBottomSheet.interfaces';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useTheme } from '@emotion/react';
import { StatusBar } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { Portal } from '@gorhom/portal';

const CustomHandle: React.FC<BottomSheetHandleProps> = ({ animatedIndex }) => {
  const indicatorHeight = useDerivedValue(() =>
    interpolate(
      animatedIndex.value,
      [1.8, 2],
      [0, StatusBar.currentHeight ?? 0],
    ),
  );
  const style = useAnimatedStyle(() => ({
    height: indicatorHeight.value,
  }));
  return <Animated.View style={style} />;
};

const CustomBottomSheet = React.forwardRef<
  BottomSheetMethods,
  CustomBottomSheetProps
>((props, ref) => {
  const theme = useTheme();
  const {
    enablePanDownToClose = true,
    index = -1,
    snapPoints = ['40%', '70%', '100%'],
    handleComponent = CustomHandle,
    backgroundStyle,
    children,
    ...rest
  } = props;
  return (
    <Portal>
      <BottomSheet
        ref={ref}
        index={index}
        backdropComponent={BottomSheetBackdrop}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        handleComponent={handleComponent}
        backgroundStyle={[
          backgroundStyle,
          {
            backgroundColor: theme.palette.background.paper,
          },
        ]}
        {...rest}
      >
        {children}
      </BottomSheet>
    </Portal>
  );
});

export default CustomBottomSheet;
