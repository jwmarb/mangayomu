import { ButtonBase } from '@components/Button/ButtonBase/ButtonBase';
import { ButtonProps, ButtonTextProps } from '@components/Button/Button.interfaces';
import React from 'react';
import { ButtonContainer, ButtonText } from '@components/Button/Button.base';
import { Typography } from '@components/Typography';
import { ButtonBaseProps } from '@components/Button/ButtonBase/ButtonBase.interfaces';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    onPress = () => void 0,
    color = 'primary',
    variant = 'text',
    title,
    disabled = false,
    expand = false,
    ...rest
  } = props;
  const passedProps: Required<ButtonBaseProps> = {
    color,
    variant,
    disabled,
    expand,
    onPress,
    round: false,
  };
  const buttonTextProps: ButtonTextProps = {
    color,
    variant,
    disabled,
    expand,
    round: false,
  };
  return (
    <ButtonBase {...passedProps} {...rest}>
      <ButtonContainer expand={expand}>
        <ButtonText {...buttonTextProps}>{title}</ButtonText>
      </ButtonContainer>
    </ButtonBase>
  );
};

export default Button;
