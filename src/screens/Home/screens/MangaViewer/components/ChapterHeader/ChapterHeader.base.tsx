import styled, { css } from 'styled-components/native';
export const ChapterHeaderContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(1, 3)};
    background-color: ${props.theme.palette.background.default.get()};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  `}
`;
