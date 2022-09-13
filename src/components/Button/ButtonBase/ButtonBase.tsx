import { ButtonBaseProps } from './ButtonBase.interfaces';
import { Color, Constants } from '@theme/core';
import {
  Platform,
  TouchableOpacityProps,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import {
  TouchableNativeFeedback as GestureTouchableNativeFeedback,
  TouchableOpacity as GestureTouchableOpacity,
} from 'react-native-gesture-handler';
import styled, { css } from 'styled-components/native';
import { ButtonProps } from '@components/Button/Button.interfaces';

const GestureTouchableBase = styled(
  Platform.OS === 'ios' ? GestureTouchableOpacity : GestureTouchableNativeFeedback
).attrs<ButtonBaseProps & ButtonProps>((props) => {
  const { round = false } = props;
  if (Platform.OS === 'ios') {
    return {
      activeOpacity: 0.5,
    } as TouchableOpacityProps;
  }

  if (props.color == null)
    return {
      background: GestureTouchableNativeFeedback.Ripple(
        Constants.GRAY[props.theme.palette.mode === 'light' ? 6 : 8].get(),
        round
      ),
    } as TouchableNativeFeedbackProps;

  if (props.color instanceof Color)
    return {
      background: GestureTouchableNativeFeedback.Ripple(props.color.get(), round),
    } as TouchableNativeFeedbackProps;

  return {
    background: GestureTouchableNativeFeedback.Ripple(
      props.theme.palette[props.color][props.theme.palette.mode ?? 'light'].get(),
      round
    ),
  } as TouchableNativeFeedbackProps;
})``;

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
      background: TouchableNativeFeedback.Ripple(
        Constants.GRAY[props.theme.palette.mode === 'light' ? 6 : 8].get(),
        round
      ),
    } as TouchableNativeFeedbackProps;

  if (props.color instanceof Color)
    return {
      background: TouchableNativeFeedback.Ripple(props.color.get(), round),
    } as TouchableNativeFeedbackProps;

  return {
    background: TouchableNativeFeedback.Ripple(
      props.theme.palette[props.color][props.theme.palette.mode ?? 'light'].get(),
      round
    ),
  } as TouchableNativeFeedbackProps;
})``;
const TouchableContainer = styled.View<ButtonBaseProps>`
  ${(props) => css`
    border-radius: ${props.round ? 100 : props.square ? 0 : props.theme.borderRadius}px;
    overflow: hidden;
    ${props.expand
      ? css`
          ${() => {
            switch (typeof props.expand) {
              case 'boolean':
                return props.expand ? 'flex-grow: 1' : '';
              case 'number':
                return `width: ${props.expand}px`;
              case 'string':
                return `width: ${props.expand}`;
            }
          }};
        `
      : css`
          /**
          * Uncomment and import from react-native-gesture-handler to use these properties
          */
          /* flex-direction: row;
          align-items: center; */
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
                ? props.theme.palette.action.disabled.get()
                : props.theme.palette[props.color ?? 'primary'].main.get()};
          `;
      }
    }}
    ${() => {
      switch (props.variant) {
        case 'contained':
          if (props.color instanceof Color)
            return css`
              background-color: ${props.disabled ? props.theme.palette.action.disabled.get() : props.color.get()};
            `;
          return css`
            background-color: ${props.disabled
              ? props.theme.palette.action.disabled.get()
              : props.theme.palette[props.color ?? 'primary'].main.get()};
          `;
      }
    }}
  `}
`;

const OpacityBase = styled(TouchableOpacity).attrs<ButtonBaseProps & ButtonProps>(() => {
  return {
    activeOpacity: 0.5,
  } as TouchableOpacityProps;
})``;

const GestureOpacityBase = styled(GestureTouchableOpacity).attrs<ButtonBaseProps & ButtonProps>(() => {
  return {
    activeOpacity: 0.5,
  } as TouchableOpacityProps;
})``;

export const ButtonBase: React.FC<React.PropsWithChildren<ButtonBaseProps & Omit<ButtonProps, 'title'>>> = ({
  children,
  onPress,
  onLongPress,
  opacity,
  useGestureHandler,
  ...rest
}) => {
  if (useGestureHandler) {
    return (
      <TouchableContainer {...rest}>
        {opacity ? (
          <GestureOpacityBase onPress={onPress} onLongPress={onLongPress} {...rest}>
            {children}
          </GestureOpacityBase>
        ) : (
          <GestureTouchableBase onPress={onPress} onLongPress={onLongPress} {...rest}>
            {children}
          </GestureTouchableBase>
        )}
      </TouchableContainer>
    );
  }
  return (
    <TouchableContainer {...rest}>
      {opacity ? (
        <OpacityBase onPress={onPress} onLongPress={onLongPress} {...rest}>
          {children}
        </OpacityBase>
      ) : (
        <TouchableBase onPress={onPress} onLongPress={onLongPress} {...rest}>
          {children}
        </TouchableBase>
      )}
    </TouchableContainer>
  );
};
