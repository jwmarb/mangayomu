import { TextFieldBase, TextFieldContainer } from '@components/TextField/TextField.base';
import { TextFieldProps } from '@components/TextField/TextField.interfaces';
import Flex from '@components/Flex';
import React from 'react';

const TextField: React.FC<TextFieldProps> = React.forwardRef((props, ref) => {
  const {} = props;

  return (
    <TextFieldContainer>
      <TextFieldBase ref={ref as any} {...(props as any)} />
    </TextFieldContainer>
  );
});

export default TextField;
