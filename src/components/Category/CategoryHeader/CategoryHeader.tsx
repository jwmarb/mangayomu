import styled, { css } from 'styled-components/native';
export const CategoryHeader = styled.View`
  ${(props) => css`
    padding-horizontal: ${props.theme.spacing(3)};
  `}
`;
