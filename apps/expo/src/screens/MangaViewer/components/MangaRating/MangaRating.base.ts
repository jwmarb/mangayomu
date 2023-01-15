import styled, { css } from 'styled-components/native';

export const StarContainer = styled.View<{ width: number }>`
  ${(props) => css`
    position: absolute;
    width: ${props.width > 0 ? props.width : 0}%;
  `}
`;
