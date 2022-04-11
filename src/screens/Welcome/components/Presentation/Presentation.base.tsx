import styled, { css } from 'styled-components/native';

export const ProgressDot = styled.View<{ selected: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 32px;
  ${(props) => css`
    background-color: ${props.selected
      ? props.theme.palette.primary.main.get()
      : props.theme.palette.action.disabledBackground.get()};
  `}
`;
