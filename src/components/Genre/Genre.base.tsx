import styled, { css } from 'styled-components/native';

export const GenreContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(1.6, 3)};
    background-color: ${props.theme.palette.background.paper.get()};
  `}
`;
