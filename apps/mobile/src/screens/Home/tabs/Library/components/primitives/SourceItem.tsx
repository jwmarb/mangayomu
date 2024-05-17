import { View } from 'react-native';
import React from 'react';
import Checkbox from '@/components/primitives/Checkbox';
import Pressable from '@/components/primitives/Pressable';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { SORT_ITEM_HEIGHT } from '@/screens/SourceBrowser/components/shared';
import { createStyles } from '@/utils/theme';

const styles = createStyles((theme) => ({
  pressable: {
    paddingHorizontal: theme.style.screen.paddingHorizontal * 2,
    height: SORT_ITEM_HEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.style.size.m,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: theme.style.size.s,
    alignItems: 'center',
  },
}));

export type SourceItemProps = {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChecked: (title: string, value: boolean) => void;
};

function SourceItem(props: SourceItemProps) {
  const { title, checked, onChecked, subtitle } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  function handleOnPress() {
    onChecked(title, !checked);
  }
  return (
    <Pressable style={style.pressable} onPress={handleOnPress}>
      <Checkbox checked={checked} onCheck={handleOnPress} />
      <View style={style.titleContainer}>
        <Text color="textSecondary">{title}</Text>
        <Text color="disabled" variant="body2">
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

export default React.memo(SourceItem);
