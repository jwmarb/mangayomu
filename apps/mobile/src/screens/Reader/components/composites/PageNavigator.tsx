import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import PageNumberTracker from '@/screens/Reader/components/primitives/PageNumberTracker';
import PageSlider from '@/screens/Reader/components/primitives/PageSlider';
import {
  useCurrentChapterContext,
  usePageBoundaries,
  useReaderFlatListRef,
} from '@/screens/Reader/context';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

const styles = createStyles((theme) => ({
  positioner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  container: {
    backgroundColor: theme.palette.readerOverlay,
    padding: theme.style.size.m,
    borderRadius: theme.style.size.xxl,
    marginBottom: theme.style.size.xxl,
    marginHorizontal: theme.style.size.m,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.style.size.m,
    flex: 1,
    flexDirection: 'row',
  },
  rightNavContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

function PageNavigator() {
  const contrast = useContrast();
  const flatListRef = useReaderFlatListRef();
  const boundaries = usePageBoundaries();
  const currentChapter = useCurrentChapterContext();
  const style = useStyles(styles, contrast);
  function handleOnBeginning() {
    if (currentChapter != null) {
      flatListRef.current?.scrollToIndex({
        animated: false,
        index: boundaries.current[currentChapter.link][0],
      });
    }
  }
  function handleOnEnd() {
    if (currentChapter != null) {
      flatListRef.current?.scrollToIndex({
        animated: false,
        index: boundaries.current[currentChapter.link][1],
      });
    }
  }
  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={style.positioner}
    >
      <View style={style.container}>
        <IconButton
          onPress={handleOnBeginning}
          icon={<Icon type="icon" name="chevron-left" />}
          size="small"
        />
        <PageSlider />
        <View style={style.rightNavContainer}>
          <PageNumberTracker />
          <IconButton
            onPress={handleOnEnd}
            icon={<Icon type="icon" name="chevron-right" />}
            size="small"
          />
        </View>
      </View>
    </Animated.View>
  );
}

export default React.memo(PageNavigator);
