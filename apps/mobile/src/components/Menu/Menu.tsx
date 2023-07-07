import React from 'react';
import { MenuProps } from './';
import {
  Menu as RNMenu,
  MenuOptions,
  MenuTrigger,
  MenuOptionsCustomStyle,
} from 'react-native-popup-menu';
import { useTheme } from '@emotion/react';
import { moderateScale } from 'react-native-size-matters';
import { ScrollView } from 'react-native-gesture-handler';
import Box from '@components/Box';
import Text from '@components/Text';
import { Pressable } from 'react-native';

const OptionTouchableComponent: React.FC<React.PropsWithChildren> = (props) => {
  const theme = useTheme();
  return (
    <Pressable
      android_ripple={{
        color: theme.palette.action.ripple,
      }}
      {...props}
    />
  );
};

const Menu: React.FC<MenuProps> = (props) => {
  const { trigger, children, title } = props;
  const theme = useTheme();
  const shouldUseScroll = React.Children.count(children) > 4;

  const customMenuOptionsStyles = React.useMemo(
    () => ({
      optionsContainer: {
        backgroundColor: theme.palette.background.paper,
        maxWidth: moderateScale(300),
        borderRadius: moderateScale(8),
        width: 'auto',
        overflow: 'scroll' as const,
      },
      optionsWrapper: {
        maxWidth: moderateScale(300),
        width: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderWidth: moderateScale(1),
        borderColor: theme.palette.background.disabled,
        borderRadius: moderateScale(8),
        maxHeight: shouldUseScroll ? moderateScale(200) : undefined,
        overflow: 'scroll' as const,
      } as const,
      OptionTouchableComponent,
    }),
    [theme, shouldUseScroll],
  );
  const customMenuTriggerCustomStyles = React.useMemo(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      TriggerTouchableComponent: (props: any) => (
        <>{React.cloneElement(trigger, props)}</>
      ),
    }),
    [theme, trigger],
  );

  return (
    <RNMenu>
      <MenuTrigger customStyles={customMenuTriggerCustomStyles} />
      <MenuOptions
        customStyles={customMenuOptionsStyles as MenuOptionsCustomStyle}
      >
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
        <ScrollView persistentScrollbar>{children}</ScrollView>
      </MenuOptions>
    </RNMenu>
  );
};

export default Menu;
