import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const ProgressDotBase = styled(Animated.View)<{ selected: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 32px;
  ${(props) => css`
    background-color: ${props.selected
      ? props.theme.palette.primary.main.get()
      : props.theme.palette.action.disabledBackground.get()};
  `}
`;
