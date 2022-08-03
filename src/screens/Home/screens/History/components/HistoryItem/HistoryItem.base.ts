import styled, { css } from 'styled-components/native';

export const HistoryItemContainer = styled.View`
  ${(props) => css`
    margin: ${props.theme.spacing(1, 3)};
    align-items: center;
    display: flex;
    flex-direction: row;
  `}
`;
