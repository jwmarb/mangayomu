import React from 'react';
import { CustomBottomSheetProps } from './';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useTheme } from '@emotion/react';
import {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { Portal } from '@gorhom/portal';
import { AnimatedBox } from '@components/Box';
import CustomHandle from './CustomHandle';
import useForwardedRef from '@hooks/useForwardedRef';
import useActionsHandler from '@components/CustomBottomSheet/useActionsHandler';

function CustomBottomSheet(
  props: CustomBottomSheetProps,
  ref: React.ForwardedRef<BottomSheetMethods>,
) {
  const theme = useTheme();
  const {
    enablePanDownToClose = true,
    index = -1,
    snapPoints = ['40%', '70%', '100%'],
    backgroundStyle,
    children,
    header,
    handleComponent = CustomHandle,
    showIndicator = true,
    ...rest
  } = props;
  const bottomSheet = useForwardedRef<BottomSheetMethods>(ref);
  const { onChange, onClose } = useActionsHandler(props, bottomSheet);
  const animatedIndex = useSharedValue(0);
  const styledBackground = [
    backgroundStyle,
    { backgroundColor: theme.palette.background.default },
  ];

  const borderRadius = useDerivedValue(() =>
    interpolate(animatedIndex.value, [1.8, 2], [2, 0]),
  );
  const headerStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: borderRadius.value,
    borderTopRightRadius: borderRadius.value,
  }));

  return (
    <Portal>
      <BottomSheet
        onChange={onChange}
        onClose={onClose}
        ref={bottomSheet}
        index={index}
        animatedIndex={animatedIndex}
        backdropComponent={BottomSheetBackdrop}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        handleComponent={showIndicator ? handleComponent : null}
        backgroundStyle={styledBackground}
        {...rest}
      >
        {header && (
          <AnimatedBox style={headerStyle} p="m" background-color="paper">
            {header}
          </AnimatedBox>
        )}

        {children}
      </BottomSheet>
    </Portal>
  );
}

export default React.forwardRef<BottomSheetMethods, CustomBottomSheetProps>(
  CustomBottomSheet,
);
