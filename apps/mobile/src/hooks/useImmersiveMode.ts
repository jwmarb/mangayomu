import { useTheme } from '@emotion/react';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import { NavigationBar } from '@theme/index';
import React from 'react';
import { StatusBar } from 'react-native';

const COLORS = {
  [ReaderBackgroundColor.GRAY]: '#808080',
  [ReaderBackgroundColor.BLACK]: '#000000',
  [ReaderBackgroundColor.WHITE]: '#FFFFFF',
};

export default function useImmersiveMode(
  backgroundColor: ReaderBackgroundColor,
) {
  const theme = useTheme();

  function changeColors() {
    StatusBar.setBarStyle(
      backgroundColor === ReaderBackgroundColor.BLACK
        ? 'light-content'
        : 'dark-content',
    );
    StatusBar.setBackgroundColor(COLORS[backgroundColor]);
    NavigationBar.changeColor(
      COLORS[backgroundColor],
      backgroundColor === ReaderBackgroundColor.BLACK,
    );
  }

  function show() {
    NavigationBar.show();
    StatusBar.setHidden(false);
    changeColors();
  }

  function hide() {
    NavigationBar.hide();
    StatusBar.setHidden(true);
  }

  React.useEffect(() => {
    changeColors();
  }, [backgroundColor]);

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
