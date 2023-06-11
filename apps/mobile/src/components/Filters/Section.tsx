import React from 'react';
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
import { ACCORDION_SECTION_HEADER_HEIGHT } from '@theme/constants';

export interface SectionHeaderProps {
  toggle: (key: string) => void;
  title: string;
  expanded: boolean;
}

const Section: React.FC<SectionHeaderProps> = (props) => {
  const { title, expanded, toggle } = props;
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
        height={ACCORDION_SECTION_HEADER_HEIGHT}
        mx="m"
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

export default React.memo(Section);
