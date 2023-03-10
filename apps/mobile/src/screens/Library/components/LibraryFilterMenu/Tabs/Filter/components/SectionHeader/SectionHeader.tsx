import React from 'react';
import { SectionHeaderProps } from './SectionHeader.interfaces';
import Text from '@components/Text';

import Stack from '@components/Stack';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  toggle,
  expanded,
}) => {
  const rotate = useSharedValue(expanded ? 180 : 0);
  React.useEffect(() => {
    if (expanded)
      rotate.value = withTiming(180, { duration: 150, easing: Easing.ease });
    else rotate.value = withTiming(0, { duration: 150, easing: Easing.ease });
  }, [expanded]);
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value + 'deg' }],
  }));
  const handleOnPress = () => toggle(title);
  return (
    <TouchableWithoutFeedback onPress={handleOnPress}>
      <Stack
        mx="m"
        my="s"
        flex-direction="row"
        space="s"
        justify-content="space-between"
        align-items="center"
      >
        <Text bold>{title}</Text>
        <IconButton
          icon={<Icon style={iconStyle} type="font" name="chevron-down" />}
          animated
          onPress={handleOnPress}
          compact
        />
      </Stack>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(SectionHeader);
