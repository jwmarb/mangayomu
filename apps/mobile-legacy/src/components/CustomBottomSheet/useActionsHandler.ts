import { CustomBottomSheetProps } from '@components/CustomBottomSheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
import { BackHandler } from 'react-native';
export default function useActionsHandler(
  props: CustomBottomSheetProps,
  bottomSheet: React.RefObject<BottomSheetMethods>,
) {
  const { onChange, onClose, onOpen } = props;
  const [isOpened, setIsOpened] = React.useState<boolean>(false);

  function handleOnClose() {
    onClose && onClose();
    setIsOpened(false);
  }
  function handleOnChange(
    i: number,
    // position: number, snap_type: SNAP_POINT_TYPE // Present in v5
  ) {
    onChange &&
      onChange(
        i,
        // position, snap_type // Present in v5
      );
    if (i === -1) setIsOpened(false);
    else {
      onOpen && onOpen();
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

  return {
    onClose: handleOnClose,
    onChange: handleOnChange,
  };
}
