import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { ContainerProps } from '@components/Container/Container.interfaces';

export const Container = styled(Animated.View)<ContainerProps>`
  ${(props) => {
    const { verticalPadding = true } = props;
    switch (typeof verticalPadding) {
      default:
      case 'boolean':
        if (verticalPadding)
          return css`
            padding-vertical: ${props.theme.spacing(3)};
          `;
        else return;
      case 'number':
        return css`
          padding-vertical: ${props.theme.spacing(verticalPadding)};
        `;
    }
  }}
  ${(props) => {
    const { horizontalPadding = false } = props;
    switch (typeof horizontalPadding) {
      default:
      case 'boolean':
        if (horizontalPadding)
          return css`
            padding-horizontal: ${props.theme.spacing(3)};
          `;
        else return;

      case 'number':
        return css`
          padding-horizontal: ${props.theme.spacing(horizontalPadding)};
        `;
    }
  }}
`;
