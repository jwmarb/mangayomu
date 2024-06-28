import useBoolean from '@/hooks/useBoolean';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import PageNavigator from '@/screens/Reader/components/composites/PageNavigator';
import TopOverlay from '@/screens/Reader/components/composites/TopOverlay';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const styles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  container: {
    backgroundColor: theme.palette.skeleton,
    padding: theme.style.size.s,
    flexDirection: 'row',
    gap: theme.style.size.s,
    alignItems: 'center',
  },
  chapterTitleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
}));

type OverlayProps = React.PropsWithChildren;

export default function Overlay(props: OverlayProps) {
  const { children } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const [show, toggle] = useBoolean();
  const gesture = React.useMemo(
    () =>
      Gesture.Tap()
        .onStart(() => {
          runOnJS(toggle)();
        })
        .cancelsTouchesInView(false)
        .maxDistance(0),
    [],
  );
  return (
    <>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
      {show && (
        <View style={style.wrapper}>
          <TopOverlay />
          <PageNavigator />
        </View>
      )}
    </>
  );
}
