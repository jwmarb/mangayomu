import { BottomSheetMethods } from '@app/components/BottomSheet';
const BottomSheet = React.lazy(() => import('@app/components/BottomSheet'));
import IconButton from '@app/components/IconButton';
import Text from '@app/components/Text';
import React from 'react';
import { MdSettings } from 'react-icons/md';

export default function Settings() {
  const ref = React.useRef<BottomSheetMethods>(null);
  function handleOnSettings() {
    ref.current?.open();
  }
  return (
    <>
      <IconButton icon={<MdSettings />} onPress={handleOnSettings} />
      <React.Suspense>
        <BottomSheet ref={ref}>
          <Text>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit
            numquam dolores aliquid placeat ad cum minima ipsam, non nemo fuga
            rem fugiat voluptatum adipisci ea omnis rerum molestias fugit
            soluta!
          </Text>
        </BottomSheet>
      </React.Suspense>
    </>
  );
}
