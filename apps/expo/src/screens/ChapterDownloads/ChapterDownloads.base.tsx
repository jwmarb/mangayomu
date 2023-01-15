import styled, { css } from 'styled-components/native';

export const ChapterDownloadsEmptyContainer = styled.View<{ paddingTop: number }>`
  ${(props) => css`
    padding-left: ${props.theme.spacing(2)};
    padding-right: ${props.theme.spacing(2)};
    padding-top: ${props.theme.spacing(3 + props.paddingTop / 8)};
    padding-bottom: ${props.theme.spacing(3)};
    flex-grow: 1;
    justify-content: center;
    align-items: center;
  `}
`;
