import { ButtonBase } from '@components/Button/ButtonBase/ButtonBase';
import { ButtonProps, ButtonTextProps } from '@components/Button/Button.interfaces';
import React from 'react';
import { ButtonContainer, ButtonText } from '@components/Button/Button.base';
import { Typography } from '@components/Typography';
import { ButtonBaseProps } from '@components/Button/ButtonBase/ButtonBase.interfaces';
import Spacer from '@components/Spacer';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    onPress = () => void 0,
    color = 'primary',
    variant = 'text',
    title,
    disabled = false,
    expand = false,
    icon,
    iconPlacement = 'left',
    ...rest
  } = props;
  const passedProps: Required<Omit<ButtonBaseProps, 'opacity'>> = {
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
        {icon ? (
          iconPlacement === 'left' ? (
            <>
              {React.cloneElement(icon, { size: 'small', color: color })}
              <Spacer x={1} />
              <ButtonText {...buttonTextProps}>{title}</ButtonText>
            </>
          ) : (
            <>
              <ButtonText {...buttonTextProps}>{title}</ButtonText>
              <Spacer x={1} />
              {React.cloneElement(icon, { size: 'small', color: color })}
            </>
          )
        ) : (
          <ButtonText {...buttonTextProps}>{title}</ButtonText>
        )}
      </ButtonContainer>
    </ButtonBase>
  );
};

export default Button;
