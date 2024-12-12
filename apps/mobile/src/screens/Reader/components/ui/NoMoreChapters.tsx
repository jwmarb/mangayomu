import { Dimensions, View } from 'react-native';
import React from 'react';
import Text from '@/components/primitives/Text';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';

const { width, height } = Dimensions.get('window');

const styles = createStyles((theme) => ({
  container: {
    width,
    height,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.style.size.m,
  },
}));

export default React.memo(function NoMoreChapters() {
  const style = useStyles(styles);
  return (
    <View style={style.container}>
      <Text>You have reached the end of the last chapter</Text>
    </View>
  );
});
