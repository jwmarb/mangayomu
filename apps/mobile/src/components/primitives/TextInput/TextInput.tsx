import { TextInput as NativeTextInput } from 'react-native-gesture-handler';
import { TextInputProps as NativeTextInputProps, View } from 'react-native';
import React from 'react';
import { styles } from '@/components/primitives/TextInput/styles';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import { createThemedProps } from '@/utils/theme';
import useThemedProps from '@/hooks/useThemedProps';
import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import { IconButtonProps } from '@/components/primitives/IconButton/IconButton';

export type TextInputProps = NativeTextInputProps & {
  contrast?: boolean;
  icon?: React.ReactElement<React.ComponentProps<typeof Icon>>;
  /**
   * Whether or not the `icon` prop is actually an IconButton
   */
  iconButton?: boolean;
  closeButtonProps?: Partial<IconButtonProps>;
};

const themedProps = createThemedProps((theme) => ({
  cursorColor: theme.palette.primary.main,
}));

function TextInput(
  props: TextInputProps,
  ref: React.ForwardedRef<NativeTextInput>,
) {
  const {
    contrast: contrastProp,
    onChangeText,
    icon,
    iconButton = false,
    closeButtonProps,
    style: styleProp,
    ...rest
  } = props;
  const [hasInput, setHasInput] = React.useState<boolean>(false);
  const inputRef = React.useRef<NativeTextInput>();
  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);
  const { cursorColor } = useThemedProps(themedProps, contrast);
  const textInputStyle = [
    icon != null
      ? iconButton
        ? style.containerIconButton
        : style.container
      : style.containerNoIcon,
    styleProp,
  ];
  function handleOnPress() {
    inputRef.current?.clear();
    setHasInput(false);
    if (onChangeText) {
      onChangeText('');
    }
  }
  function handleOnChangeText(e: string) {
    setHasInput(e.length > 0);
    if (onChangeText) {
      onChangeText(e);
    }
  }

  function handleRef(r: NativeTextInput) {
    inputRef.current = r;
    if (ref && 'current' in ref) ref.current = r;
  }
  return (
    <View style={style.view}>
      <NativeTextInput
        ref={handleRef}
        style={textInputStyle}
        cursorColor={cursorColor}
        onChangeText={handleOnChangeText}
        {...rest}
      />
      {icon != null &&
        React.cloneElement(icon, {
          style: iconButton ? style.iconLeftButton : style.iconLeft,
        })}
      {hasInput && (
        <IconButton
          onPress={handleOnPress}
          icon={<Icon type="icon" name="close" />}
          size="small"
          style={style.iconRight}
          {...closeButtonProps}
        />
      )}
    </View>
  );
}

export default React.forwardRef(TextInput);
