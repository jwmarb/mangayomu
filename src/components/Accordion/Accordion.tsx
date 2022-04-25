import { AccordionBaseContainer, AccordionContentContainer } from '@components/Accordion/Accordion.base';
import { AccordionProps } from '@components/Accordion/Accordion.interfaces';
import Flex from '@components/Flex';
import Icon from '@components/Icon';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import useLazyLoading from '@hooks/useLazyLoading';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const Accordion: React.FC<AccordionProps> = (props) => {
  const { title, children, expand, onToggle = () => void 0 } = props;
  const rotate = useSharedValue(0);
  const { ready } = useLazyLoading();
  const fadeIn = useSharedValue(0);

  React.useEffect(() => {
    if (expand) {
      fadeIn.value = withTiming(1, { duration: 100, easing: Easing.linear });
      rotate.value = withTiming(180, { duration: 100, easing: Easing.linear });
    } else {
      fadeIn.value = withTiming(0, { duration: 100, easing: Easing.linear });
      rotate.value = withTiming(0, { duration: 100, easing: Easing.linear });
    }
  }, [expand]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value + 'deg' }],
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  function handleOnPress() {
    onToggle((prev) => !prev);
  }

  return (
    <Flex direction='column'>
      <TouchableWithoutFeedback onPress={handleOnPress}>
        <AccordionBaseContainer>
          <Flex alignItems='center' justifyContent='space-between'>
            <Typography bold>{title}</Typography>
            <Animated.View style={style}>
              <Icon bundle='Feather' name='chevron-down' size='small' />
            </Animated.View>
          </Flex>
        </AccordionBaseContainer>
      </TouchableWithoutFeedback>
      {ready && (
        <AccordionContentContainer expand={expand}>
          <Animated.View style={fadeStyle}>{children}</Animated.View>
        </AccordionContentContainer>
      )}
    </Flex>
  );
};

export default Accordion;
