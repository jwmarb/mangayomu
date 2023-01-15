import { TextFieldBase, TextFieldContainer } from '@components/TextField/TextField.base';
import { TextFieldProps } from '@components/TextField/TextField.interfaces';
import Flex from '@components/Flex';
import React from 'react';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import { TextInput } from 'react-native';

const TextField: React.FC<TextFieldProps> = React.forwardRef((props, ref: any) => {
  const { onChangeText, ...rest } = props;
  const [text, setText] = React.useState<string>('');
  const textField = React.useRef<TextInput | null>(null);

  function handleOnChangeText(e: string) {
    if (onChangeText) onChangeText(e);
    setText(e);
  }

  function handleOnPress() {
    textField.current?.clear();
    if (onChangeText) onChangeText('');
    setText('');
  }

  return (
    <TextFieldContainer>
      <TextFieldBase
        ref={(p) => {
          ref.current = p;
          textField.current = p;
        }}
        onChangeText={handleOnChangeText}
        {...(rest as any)}
      />
      {text.length > 0 && (
        <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='close' />} onPress={handleOnPress} />
      )}
    </TextFieldContainer>
  );
});

export default TextField;
