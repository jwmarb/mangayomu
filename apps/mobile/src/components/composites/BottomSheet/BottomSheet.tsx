import React from 'react';
import GorhomBottomSheet from '@gorhom/bottom-sheet';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/components/composites/BottomSheet/styles';

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
  return (
    <GorhomBottomSheet
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
