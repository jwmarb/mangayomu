import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const AccordionBaseContainer = styled.View`
  ${(props) => css`
    flex-grow: 1;
    padding: ${props.theme.spacing(2, 3)};
  `}
`;

export const AccordionContentContainer = styled.View.attrs<{ expand?: boolean }>((props) => ({
  pointerEvents: props.expand ? 'auto' : 'none',
}))<{ expand?: boolean }>`
  ${(props) =>
    props.expand
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        `}
`;
