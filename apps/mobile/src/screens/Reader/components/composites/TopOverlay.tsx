import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import {
  useCurrentChapterContext,
  useReaderManga,
} from '@/screens/Reader/context';
import { styles } from '@/screens/Reader/styles';
import { createStyles } from '@/utils/theme';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const topOverlayStyles = createStyles((theme) => ({
  chapterTitleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  topOverlay: {
    justifyContent: 'space-between',
  },
}));

function TopOverlay() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const topOverlayStyle = useStyles(topOverlayStyles, contrast);
  const { top } = useSafeAreaInsets();
  const manga = useReaderManga();
  const chapter = useCurrentChapterContext();
  const navigation = useNavigation();
  const viewStyle = [
    style.overlay,
    topOverlayStyle.topOverlay,
    { paddingTop: top },
  ];

  function handleOnBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  function handleOnSettings() {
    navigation.navigate('ReaderSettings', { manga });
  }

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={viewStyle}>
      <IconButton
        icon={<Icon type="icon" name="arrow-left" />}
        onPress={handleOnBack}
      />
      <View style={topOverlayStyle.chapterTitleContainer}>
        <Text numberOfLines={2}>{manga.title}</Text>
        <Text numberOfLines={1} variant="body2" color="textSecondary">
          {chapter?.name}
        </Text>
      </View>
      <IconButton
        icon={<Icon type="icon" name="cog" />}
        onPress={handleOnSettings}
      />
    </Animated.View>
  );
}

export default React.memo(TopOverlay);
