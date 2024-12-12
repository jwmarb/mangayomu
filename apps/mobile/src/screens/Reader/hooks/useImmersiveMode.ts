import { useSettingsStore } from '@/stores/settings';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import NavigationBar from '@/utils/navbar';
import useBoolean from '@/hooks/useBoolean';
import useTheme from '@/hooks/useTheme';

/**
 * Manages the immersive mode for the Reader screen by controlling the visibility
 * and style of the status bar and navigation bar based on user settings and focus state.
 *
 * @post   The status bar and navigation bar visibility and style are adjusted according to the settings
 *         and focus state of the Reader screen.
 *
 * @returns A function to toggle the visibility of the status bar and navigation bar.
 */
export default function useImmersiveMode() {
  const hideStatusBar = useSettingsStore(
    (selector) => selector.reader.hideStatusBar,
  );
  const [isHidden, toggleHidden] = useBoolean();
  const theme = useTheme();

  // Changes the status bar and navbar visibility if the overlay is displayed or not
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
