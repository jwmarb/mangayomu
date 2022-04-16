import styled, { css } from 'styled-components/native';

export const MangaBaseContainer = styled.View`
  ${(props) => css`
    width: ${props.theme.spacing(13)};
  `}
`;
