import React from 'react';
import { View } from 'react-native';
import Pressable from '@/components/primitives/Pressable';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles, createThemedProps } from '@/utils/theme';
import Icon from '@/components/primitives/Icon';
import useThemedProps from '@/hooks/useThemedProps';

const styles = createStyles((theme) => ({
  container: {
    ...theme.helpers.elevation(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.style.borderRadius.m,
    borderWidth: theme.style.borderWidth.s,
    overflow: 'hidden',
  },
  selectedContainer: {
    borderColor: theme.palette.primary.main,
  },
  notSelectedContainer: {
    borderColor: 'transparent',
  },
  pressable: {
    padding: theme.style.size.l,
    gap: theme.style.size.m,
  },
  check: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: theme.style.size.s,
    backgroundColor: theme.palette.primary.main,
    borderBottomLeftRadius: theme.style.borderRadius.m,
  },
}));

const themedProps = createThemedProps((theme) => ({
  android_ripple: {
    color: theme.palette.primary.main,
  },
}));

export type SelectableOptionProps = {
  title: string;
  selected?: boolean;
  onSelect?: (val: any) => void;
  value?: any;
} & React.PropsWithChildren;

export default function SelectableOption(props: SelectableOptionProps) {
  const { title, selected, children, onSelect, value } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { android_ripple } = useThemedProps(themedProps, contrast);
  const viewStyle = [
    selected ? style.selectedContainer : style.notSelectedContainer,
    style.container,
  ];
  function handleOnPress() {
    onSelect?.(value);
  }
  return (
    <View style={viewStyle}>
      {selected && (
        <Icon
          color="primary@contrast"
          type="icon"
          name="check-bold"
          style={style.check}
          size="small"
        />
      )}
      <Pressable
        style={style.pressable}
        onPress={handleOnPress}
        android_ripple={selected ? android_ripple : undefined}
      >
        {children}
        <Text
          variant="body2"
          color={selected ? 'primary' : 'textPrimary'}
          alignment="center"
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
}
