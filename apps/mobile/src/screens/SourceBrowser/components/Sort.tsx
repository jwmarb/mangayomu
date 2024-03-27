import { MutableSortFilter } from '@mangayomu/schema-creator';
import React from 'react';
import { View } from 'react-native';
import Icon from '@/components/primitives/Icon';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
  },
}));

type SortPorps = {
  title: string;
  sort: MutableSortFilter<string>;
};

function Sort(props: SortPorps) {
  const { title, sort } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <View style={style.container}>
      <Text>{title}</Text>
      <Icon type="icon" name="chevron-right" />
    </View>
  );
}

export default React.memo(Sort);
