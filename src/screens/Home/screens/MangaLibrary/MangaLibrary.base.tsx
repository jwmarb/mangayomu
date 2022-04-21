import styled, { css } from 'styled-components/native';
export const MangaContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(0, 1)};
  `}
`;

export const ExpandedSortContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(3)};
    background-color: ${props.theme.palette.background.paper.get()};
  `}
`;
