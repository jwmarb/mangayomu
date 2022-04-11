import { ButtonBaseProps } from './ButtonBase.interfaces';
import { Color, Constants } from '@theme/core';
import { Platform, TouchableOpacityProps, TouchableNativeFeedbackProps } from 'react-native';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import styled, { css } from 'styled-components/native';
import { ButtonProps } from '@components/Button/Button.interfaces';
import { Flex } from '@components/Flex';

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

  if (props.color instanceof Color)
    return {
      background: TouchableNativeFeedback.Ripple(props.color.get(), round),
    } as TouchableNativeFeedbackProps;

  return {
    background: TouchableNativeFeedback.Ripple(
      props.theme.palette[props.color][props.theme.palette.mode === 'dark' ? 'light' : 'dark'].get(),
      round
    ),
  } as TouchableNativeFeedbackProps;
})``;
const TouchableContainer = styled.View<ButtonBaseProps>`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
    overflow: hidden;
    ${props.expand
      ? css`
          ${() => {
            switch (typeof props.expand) {
              case 'boolean':
                return props.expand ? 'width: 100%' : '';
              case 'number':
                return `width: ${props.expand}px`;
              case 'string':
                return `width: ${props.expand}`;
            }
          }};
        `
      : css`
          flex-direction: row;
          align-items: center;
        `}
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
                ? props.theme.palette[props.color ?? 'primary'].main.toDisabled().get()
                : props.theme.palette[props.color ?? 'primary'].main.get()};
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
              ? props.theme.palette[props.color ?? 'primary'].main.toDisabled().get()
              : props.theme.palette[props.color ?? 'primary'].main.get()};
          `;
      }
    }}
  `}
`;

export const ButtonBase: React.FC<ButtonBaseProps & Omit<ButtonProps, 'title'>> = ({ children, onPress, ...rest }) => {
  return (
    <TouchableContainer {...rest}>
      <TouchableBase onPress={onPress} {...rest}>
        {children}
      </TouchableBase>
    </TouchableContainer>
  );
};
