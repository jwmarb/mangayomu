import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import Text from '@/components/primitives/Text';
import useBoolean from '@/hooks/useBoolean';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import {
  useCurrentChapterContext,
  useReaderManga,
} from '@/screens/Reader/context';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutUp,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { top } = useSafeAreaInsets();
  const manga = useReaderManga();
  const chapter = useCurrentChapterContext();
  return (
    <>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
      {show && (
        <View style={style.wrapper}>
          <Animated.View
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={[style.container, { paddingTop: top }]}
          >
            <IconButton icon={<Icon type="icon" name="arrow-left" />} />
            <View>
              <Text numberOfLines={2}>{manga.title}</Text>
              <Text numberOfLines={1} variant="body2" color="textSecondary">
                {chapter?.name}
              </Text>
            </View>
          </Animated.View>
        </View>
      )}
    </>
  );
}
