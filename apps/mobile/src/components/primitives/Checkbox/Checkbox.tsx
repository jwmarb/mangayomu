import { View } from 'react-native';
import { styles } from '@/components/primitives/Checkbox/styles';
import Icon from '@/components/primitives/Icon';
import Pressable from '@/components/primitives/Pressable';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';

export type CheckboxProps = {
  checked?: boolean;
  onCheck?: (newValue: boolean) => void;
  contrast?: boolean;
};

const android_ripple = {
  borderless: true,
};

export default function Checkbox(props: CheckboxProps) {
  const { checked, onCheck, contrast: isContrast } = props;
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
    >
      <View style={checked ? style.checkboxChecked : style.checkbox}>
        <Icon
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
