import { useSelect, useValue } from 'react-cosmos/client';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import Pressable from '@/components/primitives/Pressable';
import useModeSelect from '@/hooks/useModeSelect';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import Text from '@/components/primitives/Text';
import useTheme from '@/hooks/useTheme';

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
  },
  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function PressableFixture() {
  const mode = useModeSelect();
  const style = useStyles(styles, mode);
  const theme = useTheme(mode);

  const [title] = useValue<string>('title', {
    defaultValue: 'This whole entire screen is pressable',
  });
  const [selectedRippleRadius] = useSelect<string>('ripple radius', {
    defaultValue: 'undefined',
    options: ['16', '32', 'theme', 'undefined'] as string[],
  });
  const [selectedRippleColor] = useSelect<string>('ripple color', {
    defaultValue: 'theme',
    options: ['primary', 'secondary', 'theme', 'undefined'] as string[],
  });
  const [foreground] = useSelect('foreground', {
    defaultValue: 'false',
    options: ['true', 'false'],
  });
  const [borderless] = useSelect('foreground', {
    defaultValue: 'false',
    options: ['true', 'false'],
  });

  const rippleRadius = React.useMemo(() => {
    switch (selectedRippleRadius) {
      case 'theme':
        return theme.style.borderRadius;
      case 'undefined':
        return undefined;
      default:
        return parseInt(selectedRippleRadius);
    }
  }, [selectedRippleRadius, theme.style.borderRadius]);
  const rippleColor = React.useMemo(() => {
    switch (selectedRippleColor) {
      case 'theme':
        return theme.palette.action.ripple;
      case 'undefined':
        return undefined;
      default:
        return theme.palette[
          selectedRippleColor as unknown as 'primary' | 'secondary'
        ].main;
    }
  }, [selectedRippleColor, theme.palette]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function handleOnPress() {}
  return (
    <SafeAreaView style={style.container}>
      <Pressable
        style={style.pressable}
        android_ripple={{
          radius: rippleRadius,
          color: rippleColor,
          foreground: JSON.parse(foreground),
          borderless: JSON.parse(borderless),
        }}
        onPress={handleOnPress}
      >
        <Text contrast={mode}>{title}</Text>
      </Pressable>
    </SafeAreaView>
  );
}
