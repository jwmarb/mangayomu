import { useTheme } from '@emotion/react';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import { NavigationBar } from '@theme/index';
import React from 'react';
import { StatusBar } from 'react-native';

export default function useImmersiveMode() {
  const theme = useTheme();

  function show() {
    NavigationBar.show();
    StatusBar.setHidden(false);
    StatusBar.setBarStyle('light-content');
  }

  function hide() {
    NavigationBar.hide();
    StatusBar.setHidden(true);
  }

  React.useEffect(() => {
    hide();
    return () => {
      NavigationBar.show();
      StatusBar.setHidden(false);
      StatusBar.setBarStyle(
        theme.mode === 'dark' ? 'light-content' : 'dark-content',
      );
      StatusBar.setBackgroundColor('transparent');
      NavigationBar.changeColor('transparent');
    };
  }, []);

  return [show, hide];
}
