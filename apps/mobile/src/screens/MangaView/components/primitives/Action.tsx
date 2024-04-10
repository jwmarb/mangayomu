import React from 'react';
import { IconProps } from '@/components/primitives/Icon';
import Pressable from '@/components/primitives/Pressable';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useThemedProps from '@/hooks/useThemedProps';
import { createStyles, createThemedProps } from '@/utils/theme';

const styles = createStyles((theme) => ({
  pressable: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: theme.style.size.xl,
    gap: theme.style.size.s,
  },
}));

const themedProps = createThemedProps((theme) => ({
  android_ripple: {
    borderless: true,
    color: theme.palette.primary.ripple,
  },
}));

export type ActionProps = {
  title: string;
  icon: React.ReactElement<IconProps>;
  onPress?: () => void;
};

export default function Action(props: ActionProps) {
  const { title, icon, onPress } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { android_ripple } = useThemedProps(themedProps, contrast);
  return (
    <Pressable
      style={style.pressable}
      android_ripple={android_ripple}
      onPress={onPress}
    >
      {React.cloneElement(icon, { color: 'primary' })}
      <Text variant="button">{title}</Text>
    </Pressable>
  );
}
