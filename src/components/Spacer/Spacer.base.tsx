import { SpacerProps } from '@components/Spacer/Spacer.interfaces';
import styled, { css } from 'styled-components/native';

export const SpacerBaseX = styled.View<{ x: number }>`
  ${(props) => css`
    width: ${props.theme.spacing(props.x)};
  `}
`;

export const SpacerBaseY = styled.View<{ y: number }>`
  ${(props) => css`
    height: ${props.theme.spacing(props.y)};
  `}
`;
