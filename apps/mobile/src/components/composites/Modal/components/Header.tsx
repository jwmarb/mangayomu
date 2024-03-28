import { View } from 'react-native';
import { styles } from '@/components/composites/Modal/styles';
import Text, { TextProps } from '@/components/primitives/Text';
import TextInput, {
  TextInputProps,
} from '@/components/primitives/TextInput/TextInput';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';

export type ModalHeaderProps =
  | ({
      title?: string;
    } & TextProps)
  | ({
      input?: boolean;
    } & TextInputProps);

export default function Header(
  props: React.PropsWithChildren<ModalHeaderProps>,
) {
  if ('title' in props) {
    const { title, ...textProps } = props;
    const contrast = useContrast();
    const style = useStyles(styles, contrast);
    const textStyle = [style.header, textProps?.style];
    return (
      <Text
        style={textStyle}
        variant={textProps?.variant ?? 'h4'}
        {...textProps}
      >
        {title}
      </Text>
    );
  }

  if ('input' in props) {
    const { style: inputStyleProp, ...inputProps } = props;
    const contrast = useContrast();
    const style = useStyles(styles, contrast);
    const textInputStyle = [style.textInputStyle, inputStyleProp];
    return (
      <View style={style.input}>
        <TextInput style={textInputStyle} {...inputProps} />
      </View>
    );
  }

  return null;
}
