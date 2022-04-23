import styled, { css } from 'styled-components/native';

export const LoadingContainer = styled.View`
  ${(props) => css`
    background-color: ${props.theme.palette.background.default.get()};
    flex-grow: 1;
    flex-direction: column;
    height: 400px;
  `}
`;
