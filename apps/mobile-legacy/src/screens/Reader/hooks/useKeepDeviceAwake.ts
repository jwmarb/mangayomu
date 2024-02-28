import useAppSelector from '@hooks/useAppSelector';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import React from 'react';

export default function useKeepDeviceAwake() {
  const keepDeviceAwake = useAppSelector(
    (state) => state.settings.reader.keepDeviceAwake,
  );
  React.useEffect(() => {
    if (keepDeviceAwake) {
      activateKeepAwake();
      return () => {
        deactivateKeepAwake();
      };
    }
  }, [keepDeviceAwake]);
}
