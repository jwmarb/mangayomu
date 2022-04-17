import { ButtonProps } from '@components/Button/Button.interfaces';
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

export const ButtonText = styled.Text.attrs({ numberOfLines: 1 })<
  Omit<Required<ButtonBaseProps>, 'onPress' | 'opacity'>
>`
  ${(props) => css`
    ${props.theme.typography.button};
    text-align: ${props.expand ? 'center' : 'left'};
    color: ${() => {
      if (props.color == null) return props.theme.palette.text.primary.get();
      switch (props.variant) {
        case 'contained':
          if (props.color instanceof Color) return props.color.getContrastText();
          return props.theme.palette[props.color].main.getContrastText();
        default:
          if (props.color instanceof Color) return props.color.get();
          return props.theme.palette[props.color].main.get();
      }
    }};
  `}
`;
