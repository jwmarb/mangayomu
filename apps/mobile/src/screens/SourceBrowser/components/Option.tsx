import { MutableOptionFilter } from '@mangayomu/schema-creator';
import React from 'react';
import { View } from 'react-native';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    height: 1000,
  },
}));

type OptionProps = {
  title: string;
  option: MutableOptionFilter<string>;
};

function Option(props: OptionProps) {
  const { title, option } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);

  return (
    <View style={style.container}>
      <Text>{title}</Text>
    </View>
  );
}

export default React.memo(Option);
