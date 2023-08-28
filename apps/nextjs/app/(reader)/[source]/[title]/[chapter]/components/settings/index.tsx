import ForSeries from '@app/(reader)/[source]/[title]/[chapter]/components/settings/forseries';
import { BottomSheetMethods } from '@app/components/BottomSheet';
const BottomSheet = React.lazy(() => import('@app/components/BottomSheet'));
import IconButton from '@app/components/IconButton';
import Tabs from '@app/components/Tabs';
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
          <Tabs>
            <div className="flex">
              <Tabs.Tab>Reader</Tabs.Tab>
              <Tabs.Tab>Advanced</Tabs.Tab>
            </div>
            <Tabs.Panel>
              <ForSeries />
            </Tabs.Panel>
            <Tabs.Panel>
              <Text>Tab2</Text>
            </Tabs.Panel>
          </Tabs>
        </BottomSheet>
      </React.Suspense>
    </>
  );
}
