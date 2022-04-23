import { DividerProps } from '@components/Divider/Divider.interfaces';
import styled, { css } from 'styled-components/native';

export const Divider = styled.View<DividerProps>`
  ${(props) => {
    switch (props.orientation) {
      default:
      case 'horizontal':
        return css`
          width: 100%;
          height: 1px;
          background-color: ${props.theme.palette.divider.get()};
        `;
      case 'vertical':
        return css`
          width: 1px;
          height: 100%;
          background-color: ${props.theme.palette.divider.get()};
        `;
    }
  }}
`;
