import { Typography, Spacer, Icon, Button, Modal, ListItem, List, Flex, IconButton } from '@components/core';
import {
  ChapterHeaderContainer,
  ChapterLoadingIndicator,
} from '@screens/MangaViewer/components/ChapterHeader/ChapterHeader.base';
import { ChapterHeaderProps } from '@screens/MangaViewer/components/ChapterHeader/ChapterHeader.interfaces';
import React from 'react';
import { Dimensions } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
const { width } = Dimensions.get('window');
const halfWidth = width / 2;

const ChapterHeader: React.FC<ChapterHeaderProps> = (props) => {
  const { chapters, handleOnOpenModal, loading } = props;
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(-halfWidth);
  React.useEffect(() => {
    if (loading) {
      translateX.value = withRepeat(
        withSequence(
          withTiming(width * 0.5, { duration: 800, easing: Easing.sin }),
          withTiming(width * 1.5, { duration: 2000, easing: Easing.out(Easing.sin) }),
          withTiming(-halfWidth, { duration: 0 })
        ),
        -1
      );
    } else {
      opacity.value = withSpring(0);
      translateX.value = -halfWidth;
    }
  }, [loading]);

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <>
      <ChapterHeaderContainer>
        <ChapterLoadingIndicator style={loadingStyle} />
        <Typography variant='subheader'>
          {chapters?.length ? `Chapters - ${chapters.length}` : 'Updating...'}
        </Typography>
        <Spacer x={2} />
        <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='sort' />} onPress={handleOnOpenModal} />
      </ChapterHeaderContainer>
    </>
  );
};

export default React.memo(ChapterHeader);
