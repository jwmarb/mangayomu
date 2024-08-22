import useBoolean from '@/hooks/useBoolean';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import PageNavigator, {
  PageNavigatorMethods,
} from '@/screens/Reader/components/composites/PageNavigator';
import TopOverlay, {
  TopOverlayMethods,
} from '@/screens/Reader/components/composites/TopOverlay';
import { useSettingsStore } from '@/stores/settings';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { StatusBar, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import NavigationBar from '@/utils/navbar';

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
  const topRef = React.useRef<TopOverlayMethods>(null);
  const pageNavRef = React.useRef<PageNavigatorMethods>(null);
  const hideStatusBar = useSettingsStore((state) => state.reader.hideStatusBar);
  const [isHidden, toggleHidden] = useBoolean();
  function toggle() {
    toggleHidden();
    topRef.current?.toggle();
    pageNavRef.current?.toggle();
  }
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

  React.useEffect(() => {
    if (hideStatusBar) {
      if (isHidden) {
        StatusBar.setHidden(true);
        NavigationBar.hide();
      } else {
        StatusBar.setHidden(false);
        NavigationBar.show();
      }
    }
  }, [isHidden]);

  return (
    <>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
      <View style={style.wrapper}>
        <TopOverlay ref={topRef} />
        <PageNavigator ref={pageNavRef} />
      </View>
    </>
  );
}
