import { useSettingsStore } from '@/stores/settings';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import NavigationBar from '@/utils/navbar';
import useBoolean from '@/hooks/useBoolean';

export default function useImmersiveMode() {
  const hideStatusBar = useSettingsStore(
    (selector) => selector.reader.hideStatusBar,
  );
  const [isHidden, toggleHidden] = useBoolean();

  React.useEffect(() => {
    if (hideStatusBar) {
      if (isHidden) {
        StatusBar.setHidden(true);
        NavigationBar.hide();
      } else {
        StatusBar.setHidden(false);
        NavigationBar.show();
      }
      return () => {
        StatusBar.setHidden(false);
        NavigationBar.show();
      };
    }
  }, []);

  return toggleHidden;
}
