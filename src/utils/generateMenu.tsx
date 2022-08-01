import Icon from '@components/Icon';
import MenuOption from '@components/MenuOption';
import React from 'react';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from 'styled-components/native';

export type GenerateMenuOptions<V, T extends Record<string, V>> = {
  onSelect: (val: V) => void;
  icons?: {
    [K in keyof T]: React.ReactElement<React.ComponentProps<typeof Icon>>;
  };
};

export default function generateMenu<T extends Record<string, V>, V>(
  object: T,
  selectOption: V,
  options: GenerateMenuOptions<V, T>
): [React.FC<{}>, () => void, () => void] {
  const [opened, setOpened] = React.useState<boolean>(false);
  const handleOnClose = React.useCallback(() => {
    setOpened(false);
  }, [setOpened]);
  const handleOnSelect = React.useCallback(
    (val: V) => {
      options.onSelect(val);
      handleOnClose();
    },
    [handleOnClose]
  );
  const theme = useTheme();
  const p = {
    Menu: React.useCallback(
      ({ children }) => (
        <Menu opened={opened} onClose={handleOnClose} onSelect={handleOnSelect} onBackdropPress={handleOnClose}>
          <MenuTrigger>{children}</MenuTrigger>
          <MenuOptions customStyles={theme.menuOptionsStyle}>
            {Object.entries(object).map(([k, x]) => (
              <MenuOption
                key={x as any}
                color={x === selectOption ? 'primary' : 'textPrimary'}
                text={x + ''}
                icon={options.icons ? options.icons[k] : undefined}
              />
            ))}
          </MenuOptions>
        </Menu>
      ),
      [handleOnSelect, handleOnClose, opened, theme.menuOptionsStyle, object, options.icons]
    ) as React.FC,
    onOpen: React.useCallback(() => setOpened(true), [setOpened]),
    onClose: handleOnClose,
  };
  return [p.Menu, p.onOpen, p.onClose];
}
