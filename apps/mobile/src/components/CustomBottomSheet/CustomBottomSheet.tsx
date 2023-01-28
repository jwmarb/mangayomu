import React, { useImperativeHandle } from 'react';
import { CustomBottomSheetProps } from './CustomBottomSheet.interfaces';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useTheme } from '@emotion/react';
import { BackHandler, StatusBar } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { Portal } from '@gorhom/portal';
import Box from '@components/Box';

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
    onClose,
    onChange,
    header,
    ...rest
  } = props;
  const bottomSheet = React.useRef<BottomSheet>(null);
  const isOpened = React.useRef<boolean>(false);
  const styledBackground = React.useMemo(
    () => [
      backgroundStyle,
      { backgroundColor: theme.palette.background.paper },
    ],
    [theme.palette.background.paper, backgroundStyle],
  );
  function handleOnClose() {
    onClose && onClose();
    isOpened.current = false;
  }
  function handleOnChange(i: number) {
    onChange && onChange(i);
    if (i === -1) isOpened.current = false;
    else isOpened.current = true;
  }
  React.useEffect(() => {
    const p = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isOpened.current) {
        bottomSheet.current?.close();
        return true;
      }
      return false;
    });
    return () => {
      p.remove();
    };
  }, []);
  return (
    <Portal>
      <BottomSheet
        onChange={handleOnChange}
        onClose={handleOnClose}
        ref={(r) => {
          (bottomSheet as any).current = r;
          (ref as any).current = r;
        }}
        index={index}
        backdropComponent={BottomSheetBackdrop}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        handleComponent={handleComponent}
        backgroundStyle={styledBackground}
        {...rest}
      >
        {header && (
          <Box my="l" mx="m">
            {header}
          </Box>
        )}
        {children}
      </BottomSheet>
    </Portal>
  );
});

export default CustomBottomSheet;
