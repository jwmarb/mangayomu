import { BackgroundColor, useSettingsStore } from '@/stores/settings';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import NavigationBar from '@/utils/navbar';
import useBoolean from '@/hooks/useBoolean';
import { useReaderBackgroundColor } from '@/screens/Reader/context';
import useTheme from '@/hooks/useTheme';

export default function useImmersiveMode() {
  const hideStatusBar = useSettingsStore(
    (selector) => selector.reader.hideStatusBar,
  );
  const [isHidden, toggleHidden] = useBoolean();
  const theme = useTheme();

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
  }, [hideStatusBar, isHidden]);

  // Changes the color of the status bar nad nav bar for the reader only
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      return () => {
        StatusBar.setBarStyle(
          theme.mode === 'dark' ? 'light-content' : 'dark-content',
        );
      };
    }, [theme.mode]),
  );

  return toggleHidden;
}
