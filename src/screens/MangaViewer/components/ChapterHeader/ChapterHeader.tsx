import { Typography, Spacer, Icon, Button, Modal, ListItem, List, Flex, IconButton } from '@components/core';
import {
  ChapterHeaderContainer,
  ChapterLoadingIndicator,
  ChapterLoadingIndicatorBackground,
} from '@screens/MangaViewer/components/ChapterHeader/ChapterHeader.base';
import { ChapterHeaderProps } from '@screens/MangaViewer/components/ChapterHeader/ChapterHeader.interfaces';
import React from 'react';
import { Dimensions } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
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
  const bgOpacity = useSharedValue(0);
  const translateX = useSharedValue(-halfWidth);
  React.useEffect(() => {
    if (loading) {
      bgOpacity.value = withSpring(0.55);
      translateX.value = withRepeat(
        withSequence(
          withTiming(width, { duration: 1000, easing: Easing.out(Easing.sin) }),
          withTiming(-halfWidth, { duration: 0 })
        ),
        -1
      );
    } else {
      bgOpacity.value = withTiming(0, { duration: 1500, easing: Easing.ease });
      opacity.value = withTiming(0, { duration: 1500, easing: Easing.ease });
    }
  }, [loading]);

  useDerivedValue(() => {
    if (opacity.value === 0) translateX.value = -halfWidth;
  }, [opacity.value]);

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <>
      <ChapterHeaderContainer>
        <ChapterLoadingIndicator style={loadingStyle} />
        <ChapterLoadingIndicatorBackground style={bgStyle} />
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
