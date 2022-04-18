import styled, { css } from 'styled-components/native';
export const MangaContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(0, 1)};
  `}
`;
