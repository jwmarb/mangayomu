import { View } from 'react-native';
import React from 'react';
import { styles } from '@/components/primitives/Checkbox/styles';
import Icon from '@/components/primitives/Icon';
import Pressable from '@/components/primitives/Pressable';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { PressableProps } from '@/components/primitives/Pressable/Pressable';

export type CheckboxProps = {
  checked?: boolean;
  onCheck?: (newValue: boolean) => void;
  contrast?: boolean;
} & Omit<PressableProps, 'onPress'>;

const android_ripple = {
  borderless: true,
};

export default function Checkbox(props: CheckboxProps) {
  const { checked, onCheck, contrast: isContrast, ...rest } = props;
  const contrast = useContrast(isContrast);
  const style = useStyles(styles, contrast);
  function onPress() {
    onCheck?.(!checked);
  }
  return (
    <Pressable
      android_ripple={android_ripple}
      style={style.pressableCheckbox}
      onPress={onPress}
      {...rest}
    >
      <View style={checked ? style.checkboxChecked : style.checkbox} >
        <Icon
        testID="__checkbox_check__"
          style={checked ? undefined : style.uncheckedIcon}
          size="small"
          type="icon"
          name="check-bold"
          color="primary@contrast"
        />
      </View>
    </Pressable>
  );
}
