import Box from '@components/Box/Box';
import React from 'react';
import { OverlayProps } from './';
import { Pressable } from 'react-native';
import { useTheme } from '@emotion/react';

const Overlay: React.FC<OverlayProps> = ({ onPress }) => {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress}>
      <Box
        width="100%"
        height="100%"
        background-color={theme.palette.overlay}
      />
    </Pressable>
  );
};

export default Overlay;
