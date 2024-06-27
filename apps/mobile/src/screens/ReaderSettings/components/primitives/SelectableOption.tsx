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
  wrapper: {
    padding: theme.style.size.m,
  },
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
  globalSelectedContainer: {
    borderColor: theme.palette.primary.ripple,
  },
  notSelectedContainer: {
    borderColor: 'transparent',
  },
  pressable: {
    gap: theme.style.size.m,
  },
  pressablePadding: {
    padding: theme.style.size.l,
  },
  containerOutline: {
    borderColor: theme.palette.skeleton,
  },
  check: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 2,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 10000,
  },
  checkGlobal: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 2,
    backgroundColor: theme.palette.primary.ripple,
    borderRadius: 10000,
  },
}));

const themedProps = createThemedProps((theme) => ({
  android_ripple: {
    color: theme.palette.primary.main,
  },
}));

export type SelectableOptionProps = {
  title?: string;
  selected?: boolean;
  globalSelected?: boolean;
  onSelect?: (val: any) => void;
  value?: any;
  hideTitle?: boolean;
  noPadding?: boolean;
  outline?: boolean;
} & React.PropsWithChildren;

export default function SelectableOption(props: SelectableOptionProps) {
  const {
    noPadding = false,
    hideTitle = false,
    outline = false,
    title,
    selected,
    children,
    onSelect,
    value,
    globalSelected,
  } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { android_ripple } = useThemedProps(themedProps, contrast);
  const viewStyle = [
    selected
      ? style.selectedContainer
      : globalSelected
        ? style.globalSelectedContainer
        : style.notSelectedContainer,
    outline && !selected ? style.containerOutline : undefined,
    style.container,
  ];
  function handleOnPress() {
    onSelect?.(value);
  }

  const pressableStyle = [
    style.pressable,
    noPadding ? undefined : style.pressablePadding,
  ];

  return (
    <View style={style.wrapper}>
      <View style={viewStyle}>
        <Pressable
          style={pressableStyle}
          onPress={handleOnPress}
          android_ripple={selected ? android_ripple : undefined}
        >
          {children}
          {!hideTitle && (
            <Text
              variant="body2"
              color={
                selected
                  ? 'primary'
                  : globalSelected
                    ? 'disabled'
                    : 'textPrimary'
              }
              alignment="center"
            >
              {title}
            </Text>
          )}
        </Pressable>
      </View>
      {selected && (
        <Icon
          color={selected ? 'primary@contrast' : 'textPrimary'}
          type="icon"
          name="check-bold"
          style={
            selected
              ? style.check
              : globalSelected
                ? style.checkGlobal
                : undefined
          }
          size="small"
        />
      )}
    </View>
  );
}
