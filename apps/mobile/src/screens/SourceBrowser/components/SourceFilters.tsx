import { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import BottomSheet from '@/components/composites/BottomSheet';
import Text from '@/components/primitives/Text';
import useLoadAfterInteractions from '@/hooks/useLoadAfterInteractions';
import { useSourceContext } from '@/components/composites/Manga';

function SourceFilters(_: unknown, ref: React.ForwardedRef<BottomSheet>) {
  const ready = useLoadAfterInteractions();
  const source = useSourceContext();
  if (!ready || source?.FILTER_SCHEMA == null) return null;
  return (
    <BottomSheet ref={ref}>
      <BottomSheetView>
        <Text>
          {Object.keys(source.FILTER_SCHEMA.schema as Record<string, unknown>)}
        </Text>
      </BottomSheetView>
    </BottomSheet>
  );
}

export default React.forwardRef(SourceFilters);
