import useAppSelector from '@hooks/useAppSelector';
import { useWakeLock } from 'react-screen-wake-lock';
import React from 'react';

export default function useKeepDeviceAwake() {
  const { request, release, released } = useWakeLock();
  const keepDeviceAwake = useAppSelector(
    (state) => state.settings.reader.keepDeviceAwake,
  );
  React.useEffect(() => {
    if (keepDeviceAwake) {
      if (released) request();
      return () => {
        if (!released) release();
      };
    }
  }, [keepDeviceAwake]);
}
