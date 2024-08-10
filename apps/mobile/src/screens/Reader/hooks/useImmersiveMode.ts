import { useSettingsStore } from '@/stores/settings';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import NavigationBar from '@/utils/navbar';

export default function useImmersiveMode() {
  const hideStatusBar = useSettingsStore(
    (selector) => selector.reader.hideStatusBar,
  );

  useFocusEffect(
    React.useCallback(() => {
      if (hideStatusBar) {
        StatusBar.setHidden(true);
        NavigationBar.hide();
        return () => {
          StatusBar.setHidden(false);
          NavigationBar.show();
        };
      }
    }, [hideStatusBar]),
  );
}
