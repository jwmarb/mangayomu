import styled, { css } from 'styled-components/native';

export const GenreContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(1.2, 2.4)};
    background-color: ${props.theme.palette.background.paper.get()};
  `}
`;
