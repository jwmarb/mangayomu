import { ButtonProps } from '@components/Button/Button.interfaces';
import { ButtonBaseProps } from '@components/Button/ButtonBase/ButtonBase.interfaces';
import { Color } from '@theme/core';
import styled, { css } from 'styled-components/native';

export const ButtonContainer = styled.View<Pick<ButtonProps, 'expand'>>`
  ${(props) => css`
    flex-grow: 1;
    padding: ${props.theme.spacing(1.5, 2)};
  `}
`;

export const ButtonText = styled.Text<Omit<Required<ButtonBaseProps>, 'onPress'>>`
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
