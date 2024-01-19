import React from 'react';
import { CustomBottomSheetProps } from './';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  SNAP_POINT_TYPE,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useTheme } from '@emotion/react';
import { BackHandler } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { Portal } from '@gorhom/portal';
import { AnimatedBox } from '@components/Box';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomHandle: React.FC<BottomSheetHandleProps> = ({ animatedIndex }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const indicatorHeight = useDerivedValue(() =>
    interpolate(animatedIndex.value, [1.8, 2], [0, insets.top]),
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
    showIndicator = true,
    ...rest
  } = props;
  const bottomSheet = React.useRef<BottomSheet>(null);
  const animatedIndex = useSharedValue(0);
  const [isOpened, setIsOpened] = React.useState<boolean>(false);
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
    setIsOpened(false);
  }
  function handleOnChange(
    i: number,
    position: number,
    snap_type: SNAP_POINT_TYPE,
  ) {
    onChange && onChange(i, position, snap_type);
    if (i === -1) setIsOpened(false);
    else {
      onOpen();
      setIsOpened(true);
    }
  }
  React.useEffect(() => {
    const p = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isOpened) {
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (bottomSheet as any).current = r;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (ref as any).current = r;
        }}
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
};

export default React.forwardRef<BottomSheetMethods, CustomBottomSheetProps>(
  CustomBottomSheet,
);
