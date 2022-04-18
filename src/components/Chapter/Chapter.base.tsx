import styled, { css } from 'styled-components/native';
export const ChapterContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(1, 3)};
    background-color: ${props.theme.palette.background.default.get()};
  `}
`;
