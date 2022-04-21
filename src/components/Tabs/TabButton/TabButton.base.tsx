import styled, { css } from 'styled-components/native';

export const TabButtonBaseContainer = styled.View<{ width: number }>`
  ${(props) => css`
    width: ${props.width}px;
  `}
`;
