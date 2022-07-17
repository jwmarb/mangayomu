import { ButtonProps, ButtonTextProps } from '@components/Button/Button.interfaces';
import { ButtonBaseProps } from '@components/Button/ButtonBase/ButtonBase.interfaces';
import { Color } from '@theme/core';
import styled, { css } from 'styled-components/native';

export const ButtonContainer = styled.View<Pick<ButtonProps, 'expand'>>`
  ${(props) => css`
    flex-grow: 1;
    align-items: center;
    flex-direction: row;
    padding: ${props.theme.spacing(1.5, 2)};
    justify-content: center;
  `}
`;

export const ButtonText = styled.Text.attrs({ numberOfLines: 1 })<ButtonTextProps>`
  ${(props) => css`
    ${props.theme.typography().button};
    text-align: ${props.expand ? 'center' : 'left'};
    color: ${() => {
      if (props.disabled) return props.theme.palette.action.disabled.get();

      if (props.color == null) return props.theme.palette.text.primary.get();
      switch (props.variant) {
        case 'contained':
          if (props.color instanceof Color) return props.color.getContrastText().get();
          return props.theme.palette[props.color].main.getContrastText().get();
        default:
          if (props.color instanceof Color) return props.color.get();
          return props.theme.palette[props.color].main.get();
      }
    }};
  `}
`;
