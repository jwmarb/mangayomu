import Box from '@components/Box/Box';
import React from 'react';
import { OverlayProps } from './Overlay.interfaces';
import { TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '@emotion/react';

const Overlay: React.FC<OverlayProps> = ({ onPress }) => {
  const theme = useTheme();
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Box
        width="100%"
        height="100%"
        background-color={theme.palette.overlay}
      />
    </TouchableWithoutFeedback>
  );
};

export default Overlay;
