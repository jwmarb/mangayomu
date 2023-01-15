import styled, { css } from 'styled-components/native';

export const MainWrapper = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(0, 0, 12, 0)};
  `}
`;
