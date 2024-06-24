import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const styles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    flexGrow: 1,
  },
}));

export default function Overlay() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const gesture = React.useMemo(
    () =>
      Gesture.Tap().onStart(() => {
        console.log('tapped!');
      }),
    [],
  );
  return (
    <View style={style.wrapper}>
      <GestureDetector gesture={gesture}>
        <View style={style.container}>
          <Text>Hi</Text>
        </View>
      </GestureDetector>
    </View>
  );
}
