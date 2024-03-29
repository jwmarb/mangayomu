import React from 'react';
import { MenuOption, MenuOptionCustomStyle } from 'react-native-popup-menu';
import { View } from 'react-native';
import { useMenuContext } from '@/components/composites/Menu';
import { styles } from '@/components/composites/Menu/styles';
import Pressable from '@/components/primitives/Pressable';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import Text, { TextProps } from '@/components/primitives/Text';
import { IconProps } from '@/components/primitives/Icon';
import { dangerouslyGetTheme } from '@/providers/theme';

export type MenuItemProps = {
  text?: string;
  id: string;
  icon?: React.ReactElement<IconProps>;
  adornment?: React.ReactNode;
} & TextProps;

const customStyles: MenuOptionCustomStyle = {
  OptionTouchableComponent: Pressable,
  optionWrapper: {
    justifyContent: 'space-between',
    gap: dangerouslyGetTheme().style.size.m,
    alignItems: 'center',
    flexDirection: 'row',
  },
};

function MenuItem(props: MenuItemProps) {
  const { text, id, icon, adornment, ...textProps } = props;
  const callback = useMenuContext();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  function handleOnPress() {
    if (callback != null) {
      callback(id);
    }
  }

  return (
    <MenuOption
      customStyles={customStyles}
      style={style.item}
      onSelect={handleOnPress}
    >
      <View style={style.optionWrapper}>
        {icon != null && React.cloneElement(icon, { color: textProps.color })}
        <Text {...textProps}>{text}</Text>
      </View>
      {adornment}
    </MenuOption>
  );
}

export default React.memo(MenuItem);
