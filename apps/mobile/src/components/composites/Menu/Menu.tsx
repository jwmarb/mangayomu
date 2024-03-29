import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import {
  MenuOptions,
  MenuOptionsProps,
  MenuTrigger,
  MenuTriggerProps,
  Menu as PopoverMenu,
} from 'react-native-popup-menu';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/components/composites/Menu/styles';
import useContrast from '@/hooks/useContrast';
import Item from '@/components/composites/Menu/components/Item';

export type MenuCallback = (id: string) => void;
export type MenuProps = {
  contrast?: boolean;
  /**
   * Must be a memoized callback
   */
  onMenuItem?: MenuCallback;
  trigger?: React.ReactElement;
};

const MenuContext = React.createContext<((id: string) => void) | undefined>(
  undefined,
);

export const useMenuContext = () => React.useContext(MenuContext);

/**
 * Modified Menu from `react-native-popup-menu`
 */
function Menu({
  children,
  contrast: contrastProp,
  trigger,
  onMenuItem,
}: React.PropsWithChildren<MenuProps>) {
  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);
  const triggerCustomStyles: MenuTriggerProps['customStyles'] =
    trigger != null
      ? {
          TriggerTouchableComponent: (props: Record<string, unknown>) =>
            React.cloneElement(trigger, props),
        }
      : undefined;

  const optionsCustomStyles: MenuOptionsProps['customStyles'] = {
    optionsWrapper: style.optionsWrapper,
    optionsContainer: style.optionsContainer,
  };

  return (
    <PopoverMenu>
      <MenuTrigger customStyles={triggerCustomStyles}>{trigger}</MenuTrigger>
      <MenuOptions customStyles={optionsCustomStyles}>
        <MenuContext.Provider value={onMenuItem}>
          <ScrollView persistentScrollbar>{children}</ScrollView>
        </MenuContext.Provider>
      </MenuOptions>
    </PopoverMenu>
  );
}

/**
 * An item in the menu. This component is memoized
 */
Menu.Item = Item;

export default Menu;
