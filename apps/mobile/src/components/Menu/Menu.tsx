import React from 'react';
import { MenuProps } from './Menu.interfaces';
import {
  Menu as RNMenu,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useTheme } from '@emotion/react';
import { moderateScale } from 'react-native-size-matters';
import { RectButton } from 'react-native-gesture-handler';
import Box from '@components/Box';
import Text from '@components/Text';

const Menu: React.FC<MenuProps> = (props) => {
  const { trigger, children, title } = props;
  const theme = useTheme();

  const customMenuOptionsStyles = React.useMemo(
    () => ({
      optionsContainer: {
        backgroundColor: theme.palette.background.paper,
        maxWidth: moderateScale(300),
        width: 'auto',
        overflow: 'hidden' as const,
      },
      optionsWrapper: {
        maxWidth: moderateScale(300),
        width: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderWidth: moderateScale(1),
        borderColor: theme.palette.background.disabled,
        borderRadius: moderateScale(8),
        overflow: 'hidden',
      } as const,
      OptionTouchableComponent: RectButton,
    }),
    [theme],
  );
  const customMenuTriggerCustomSyles = React.useMemo(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      TriggerTouchableComponent: (props: any) => (
        <>{React.cloneElement(trigger, props)}</>
      ),
    }),
    [theme],
  );

  return (
    <RNMenu>
      <MenuTrigger customStyles={customMenuTriggerCustomSyles} />
      <MenuOptions customStyles={customMenuOptionsStyles}>
        {title && (
          <Box
            p="s"
            style={{
              borderBottomColor: theme.palette.background.disabled,
              borderBottomWidth: moderateScale(1),
            }}
          >
            <Text align="center" variant="button">
              Actions
            </Text>
          </Box>
        )}
        {children}
      </MenuOptions>
    </RNMenu>
  );
};

export default Menu;
