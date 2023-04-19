import { useTheme } from '@emotion/react';
import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';
import useReaderBackgroundColor from '@hooks/useReaderBackgroundColor';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import { NavigationBar } from '@theme/index';
import React from 'react';
import { StatusBar } from 'react-native';

const COLORS = {
  [ReaderBackgroundColor.GRAY]: 'rgb(128, 128, 128)',
  [ReaderBackgroundColor.BLACK]: '#000000',
  [ReaderBackgroundColor.WHITE]: '#FFFFFF',
};

export default function useImmersiveMode() {
  const theme = useTheme();
  const [visible, toggle] = useBoolean();
  const backgroundColor = useAppSelector(
    (state) => state.settings.reader.backgroundColor,
  );

  function show() {
    toggle(true);
    NavigationBar.show();
    StatusBar.setHidden(false);
  }

  function hide() {
    toggle(false);
    NavigationBar.hide();
    StatusBar.setHidden(true);
  }

  React.useEffect(() => {
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
  }, [backgroundColor, visible]);

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
