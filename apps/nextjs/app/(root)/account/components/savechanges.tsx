import Button from '@app/components/Button';
import Progress from '@app/components/Progress';
import Text from '@app/components/Text';
import { useSafeArea } from '@app/context/safearea';
import { animated, useSpringValue } from '@react-spring/web';
import React from 'react';

interface SaveChangesProps {
  show: boolean;
  loading: boolean;
  onSave: () => void;
  onReset: () => void;
}
export default function SaveChanges(props: SaveChangesProps) {
  const { show: visible, onSave, onReset, loading } = props;
  const show = useSpringValue(0, { config: { duration: 150 } });
  const isMobile = useSafeArea((x) => x.mobile);
  React.useEffect(() => {
    if (visible) show.start(1);
    else show.start(0);
    return () => {
      show.stop();
    };
  }, [visible, show]);

  return (
    <animated.div
      style={{
        opacity: show,
        bottom: isMobile ? 0 : show.to([0, 1], ['0', '1rem']),
      }}
      className={`fixed flex flex-row items-center justify-center left-0 right-0 ${
        isMobile ? 'bottom-0' : 'bottom-4'
      }`}
    >
      <div
        className={`px-4 py-2 bg-paper outline-default outline ${
          isMobile ? 'outline-top-2' : 'outline-2'
        } flex flex-row gap-4 items-center ${
          isMobile ? '' : 'rounded box-shadow'
        }`}
      >
        <Text>You have unsaved changes</Text>
        <div className="flex flex-row gap-2">
          <Button
            variant="contained"
            onPress={onSave}
            disabled={loading}
            icon={loading && <Progress size={1} />}
          >
            {isMobile ? 'Save' : 'Save Changes'}
          </Button>
          <Button onPress={onReset} disabled={loading}>
            Reset
          </Button>
        </div>
      </div>
    </animated.div>
  );
}
