import React from 'react';
import { ModalInputProps } from './';
import ModalBuilder from '@components/ModalBuilder/ModalBuilder';
import { ModalInputBase } from '@components/ModalInput/ModalInput.base';
import { useTheme } from '@emotion/react';
import { ModalBuilderMethods } from '@components/ModalBuilder';
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const ModalInput: React.FC<ModalInputProps> = (props) => {
  const { title, trigger, onBlur, onSubmitEditing, ...rest } = props;
  const theme = useTheme();
  const ref = React.useRef<ModalBuilderMethods>(null);
  const inputRef = React.useRef<TextInput>(null);
  function handleOnBlur(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    ref.current?.close();
    if (onBlur != null) onBlur(e);
  }

  function handleOnTrigger() {
    setTimeout(() => inputRef.current?.focus(), 0);
  }
  function handleOnSubmitEditing(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    ref.current?.close();
    if (onSubmitEditing != null) onSubmitEditing(e);
  }
  return (
    <ModalBuilder
      trigger={trigger}
      title={title}
      ref={ref}
      onTrigger={handleOnTrigger}
    >
      <ModalInputBase
        ref={inputRef}
        onBlur={handleOnBlur}
        onSubmitEditing={handleOnSubmitEditing}
        blurOnSubmit
        {...rest}
        placeholderTextColor={theme.palette.text.hint}
      />
    </ModalBuilder>
  );
};

export default ModalInput;
