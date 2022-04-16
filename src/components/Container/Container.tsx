import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  ${(props) => css`
    padding-horizontal: ${props.theme.spacing(3)};
  `}
`;
