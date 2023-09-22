import ForSeries from '@app/(reader)/[source]/[title]/[chapter]/components/settings/forseries';
import { BottomSheetMethods } from '@app/components/BottomSheet';
const BottomSheet = React.lazy(() => import('@app/components/BottomSheet'));
import IconButton from '@app/components/IconButton';
const Modal = React.lazy(() => import('@app/components/Modal'));
import Tabs from '@app/components/Tabs';
import Text from '@app/components/Text';
import { useSafeArea } from '@app/context/safearea';
import useBoolean from '@app/hooks/useBoolean';
import React from 'react';
import { MdSettings } from 'react-icons/md';

export default function Settings() {
  const [open, toggleOpen] = useBoolean();
  const handleOnClose = React.useCallback(() => {
    toggleOpen(false);
  }, [toggleOpen]);
  const handleOnOpen = () => {
    toggleOpen(true);
  };
  React.useEffect(() => {
    console.log(open);
  }, [open]);
  return (
    <>
      <IconButton icon={<MdSettings />} onPress={handleOnOpen} />
      <Container open={open} onClose={handleOnClose}>
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
      </Container>
    </>
  );
}

function Container({
  children,
  open,
  onClose,
}: React.PropsWithChildren<{ open: boolean; onClose: () => void }>) {
  const isMobile = useSafeArea((s) => s.mobile);

  return (
    <React.Suspense fallback={null}>
      {isMobile ? (
        <BottomSheet open={open} onClose={onClose}>
          {children}
        </BottomSheet>
      ) : (
        <Modal open={open} onClose={onClose}>
          {children}
        </Modal>
      )}
    </React.Suspense>
  );
}
