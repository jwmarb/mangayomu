import styled, { css } from 'styled-components/native';

export const HistorySectionContainer = styled.View`
  ${(props) => css`
    margin: ${props.theme.spacing(0, 3, 0, 3)};
  `}
`;
