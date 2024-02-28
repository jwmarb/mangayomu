import Box, { AnimatedBox } from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { InputBase } from '@components/Input/Input.base';
import { useTheme } from '@emotion/react';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { InputProps } from './';
import { moderateScale } from 'react-native-size-matters';
import { TextInput } from 'react-native';
import useBoolean from '@hooks/useBoolean';
import Adornment from '@components/Input/Adornment';

const left = moderateScale(-8);

const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    onChangeText = () => void 0,
    icon,
    iconButton,
    defaultValue = '',
    expanded,
    ...rest
  } = props;
  const [visible, toggleVisible] = useBoolean();
  const textRef = React.useRef<TextInput | null>(null);
  const opacity = useSharedValue(
    defaultValue.length > 0 || (props.value && props.value.length > 0) ? 1 : 0,
  );
  const [isInputEmpty, toggleIsInputEmpty] = useBoolean();

  React.useImperativeHandle(ref, () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(textRef.current as any),
    clear: () => {
      handleOnClear();
    },
    focus: () => {
      textRef.current?.focus();
    },
  }));
  const theme = useTheme();
  function handleOnClear() {
    textRef.current?.clear();
    onChangeText('');
    opacity.value = 0;
    toggleIsInputEmpty(true);
  }
  function handleOnChangeText(t: string) {
    onChangeText(t);
    if (t.length > 0) {
      opacity.value = 1;
      toggleIsInputEmpty(false);
    } else {
      toggleIsInputEmpty(true);
      opacity.value = 0;
    }
  }

  function handleOnToggleShowPassword() {
    toggleVisible();
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const secureTextEntry =
    rest.textContentType === 'password' ? !visible : undefined;

  const iconElement = icon && (
    <Box position="absolute" left={0} align-self="center" ml="m">
      {React.cloneElement(icon, { variant: 'icon-button' })}
    </Box>
  );

  const iconButtonElement = iconButton && (
    <Box left={left} position="absolute" align-self="center" ml="m">
      {React.cloneElement(iconButton, { compact: true })}
    </Box>
  );

  const togglePasswordVisibilityIndicator = rest.textContentType ===
    'password' && (
    <AnimatedBox style={style}>
      <IconButton
        onPress={handleOnToggleShowPassword}
        icon={<Icon type="font" name={visible ? 'eye' : 'eye-off'} />}
        compact
        color="textSecondary"
      />
    </AnimatedBox>
  );

  return (
    <Box flex-direction="row" flex-grow>
      {iconElement}
      <InputBase
        iconButton={iconButton}
        icon={icon}
        onChangeText={handleOnChangeText}
        defaultValue={defaultValue}
        expanded={expanded}
        {...rest}
        secureTextEntry={secureTextEntry}
        ref={textRef}
        placeholderTextColor={theme.palette.text.hint}
      />
      {iconButtonElement}
      <Adornment
        onClearText={handleOnClear}
        isInputEmpty={isInputEmpty}
        style={style}
      >
        {togglePasswordVisibilityIndicator}
      </Adornment>
    </Box>
  );
});

export default Input;
