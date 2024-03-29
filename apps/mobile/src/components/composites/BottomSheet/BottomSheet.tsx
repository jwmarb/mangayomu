import React from 'react';
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import { BackHandler } from 'react-native';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/components/composites/BottomSheet/styles';
import useBoolean from '@/hooks/useBoolean';

export type BottomSheet = {
  open: () => void;
  close: () => void;
};

export type BottomSheetProps = {
  children: React.ReactNode;
  contrast?: boolean;
};

const SNAP_POINTS = ['40%', '80%'];

function BottomSheetComponent(
  props: BottomSheetProps,
  ref: React.ForwardedRef<BottomSheet>,
) {
  const { children, contrast: contrastProp } = props;
  const bottomSheetRef = React.useRef<GorhomBottomSheet>(null);
  const [hidden, toggle] = useBoolean();
  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);
  React.useImperativeHandle(ref, () => ({
    open() {
      bottomSheetRef.current?.snapToIndex(0);
    },
    close() {
      bottomSheetRef.current?.close();
    },
  }));

  function handleOnChange(index: number) {
    if (index === -1) toggle(true);
    else toggle(false);
  }

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (!hidden) {
          bottomSheetRef.current?.close();
          return true;
        }
        return false;
      },
    );
    return () => {
      subscription.remove();
    };
  }, [hidden]);

  return (
    <GorhomBottomSheet
      onChange={handleOnChange}
      ref={bottomSheetRef}
      backgroundStyle={style.backgroundStyle}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      enablePanDownToClose
      handleIndicatorStyle={{ backgroundColor: 'white' }}
      index={-1}
    >
      {children}
    </GorhomBottomSheet>
  );
}

export const BottomSheet = React.forwardRef(BottomSheetComponent);
