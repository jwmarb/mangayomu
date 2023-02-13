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
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { Portal } from '@gorhom/portal';
import Box from '@components/Box';
import Text from '@components/Text';

const CustomHandle: React.FC<BottomSheetHandleProps> = ({ animatedIndex }) => {
  const theme = useTheme();
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

  const styles = React.useMemo(
    () => [
      style,
      {
        backgroundColor: theme.palette.background.paper,
      },
    ],
    [style, theme.palette.background.paper],
  );
  return <Animated.View style={styles} />;
};
const CustomBottomSheet: React.ForwardRefRenderFunction<
  BottomSheetMethods,
  CustomBottomSheetProps
> = (props, ref) => {
  const theme = useTheme();
  const {
    enablePanDownToClose = true,
    index = -1,
    snapPoints = ['40%', '70%', '100%'],
    backgroundStyle,
    children,
    onClose,
    onChange,
    header,
    handleComponent = CustomHandle,
    onOpen = () => void 0,
    ...rest
  } = props;
  const bottomSheet = React.useRef<BottomSheet>(null);
  const animatedIndex = useSharedValue(0);
  const isOpened = React.useRef<boolean>(false);
  const styledBackground = React.useMemo(
    () => [
      backgroundStyle,
      { backgroundColor: theme.palette.background.default },
    ],
    [theme.palette.background.default, backgroundStyle],
  );

  const borderRadius = useDerivedValue(() =>
    interpolate(animatedIndex.value, [1.8, 2], [2, 0]),
  );
  const headerStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: borderRadius.value,
    borderTopRightRadius: borderRadius.value,
  }));

  function handleOnClose() {
    onClose && onClose();
    isOpened.current = false;
  }
  function handleOnChange(i: number) {
    onChange && onChange(i);
    if (i === -1) isOpened.current = false;
    else {
      onOpen();
      isOpened.current = true;
    }
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
      bottomSheet.current?.close();
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
        animatedIndex={animatedIndex}
        backdropComponent={BottomSheetBackdrop}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        handleComponent={handleComponent}
        backgroundStyle={styledBackground}
        {...rest}
      >
        {header && (
          <Box
            as={Animated.View}
            style={headerStyle}
            p="m"
            background-color="paper"
          >
            {header}
          </Box>
        )}
        {children}
      </BottomSheet>
    </Portal>
  );
};

export default React.forwardRef<BottomSheetMethods, CustomBottomSheetProps>(
  CustomBottomSheet,
);
