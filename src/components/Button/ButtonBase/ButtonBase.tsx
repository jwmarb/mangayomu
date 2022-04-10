import { ButtonBaseProps } from './ButtonBase.interfaces';
import { Color, Constants } from '@theme/core';
import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableOpacityProps,
  TouchableNativeFeedbackProps,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import { ButtonProps } from '@components/Button/Button.interfaces';

const TouchableBase = styled(Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback).attrs<
  ButtonBaseProps & ButtonProps
>((props) => {
  const { round = false } = props;
  if (Platform.OS === 'ios') {
    return {
      activeOpacity: 0.5,
    } as TouchableOpacityProps;
  }

  if (props.color == null)
    return {
      background: TouchableNativeFeedback.Ripple(Constants.GRAY[4].get(), round),
    } as TouchableNativeFeedbackProps;

  return {
    background: TouchableNativeFeedback.Ripple(Color.valueOf(props.color), round),
  } as TouchableNativeFeedbackProps;
})``;
const TouchableContainer = styled.View<ButtonBaseProps>`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
    flex-direction: row;
    align-items: center;
    ${() => {
      if (props.color instanceof Color)
        return css`
          border: 1px solid ${props.color.get()};
        `;
      switch (props.variant) {
        case 'contained':
        case 'text':
          return css`
            border: 1px solid transparent;
          `;
        case 'outline':
          return css`
            border: 1px solid
              ${props.disabled
                ? props.theme.palette[props.color ?? 'primary'].toDisabled().get()
                : props.theme.palette[props.color ?? 'primary'].get()};
          `;
      }
    }}
    ${() => {
      switch (props.variant) {
        case 'contained':
          if (props.color instanceof Color)
            return css`
              background-color: ${props.disabled ? props.color.toDisabled().get() : props.color.get()};
            `;
          return css`
            background-color: ${props.disabled
              ? props.theme.palette[props.color ?? 'primary'].toDisabled().get()
              : props.theme.palette[props.color ?? 'primary'].get()};
          `;
      }
    }}
  `}
`;

export const ButtonBase: React.FC<ButtonBaseProps & Omit<ButtonProps, 'title'>> = ({ children, ...rest }) => {
  return (
    <TouchableContainer {...rest}>
      <TouchableBase {...rest}>{children}</TouchableBase>
    </TouchableContainer>
  );
};
