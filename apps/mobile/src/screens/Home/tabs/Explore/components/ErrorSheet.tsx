import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';
import BottomSheet from '@/components/composites/BottomSheet';
import Text from '@/components/primitives/Text';

function ErrorSheet(_: unknown, ref: React.ForwardedRef<BottomSheet>) {
  return (
    <BottomSheet ref={ref}>
      <BottomSheetScrollView>
        <Text>Hello World</Text>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

export default React.forwardRef(ErrorSheet);
