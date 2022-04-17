import { ButtonBase } from '@components/Button/ButtonBase/ButtonBase';
import { ButtonProps, ButtonTextProps } from '@components/Button/Button.interfaces';
import React from 'react';
import { ButtonContainer, ButtonText } from '@components/Button/Button.base';
import { Typography } from '@components/Typography';
import { ButtonBaseProps } from '@components/Button/ButtonBase/ButtonBase.interfaces';
import Spacer from '@components/Spacer';
import { useTheme } from 'styled-components/native';
import { Color } from '@theme/core';

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

  const theme = useTheme();

  const iconColor = React.useMemo(() => {
    if (disabled) return 'disabled';
    if (color instanceof Color) return Color.rgba(color.getContrastText(), color.getContrastText());
    if (variant === 'contained')
      return Color.rgba(theme.palette[color].main.getContrastText(), theme.palette[color].main.getContrastText());
    return color;
  }, [color, disabled, variant]);

  return (
    <ButtonBase {...passedProps} {...rest}>
      <ButtonContainer expand={expand}>
        {icon ? (
          iconPlacement === 'left' ? (
            <>
              {React.cloneElement(icon, { size: 'small', color: iconColor })}
              <Spacer x={1} />
              <ButtonText {...buttonTextProps}>{title}</ButtonText>
            </>
          ) : (
            <>
              <ButtonText {...buttonTextProps}>{title}</ButtonText>
              <Spacer x={1} />
              {React.cloneElement(icon, { size: 'small', color: iconColor })}
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
