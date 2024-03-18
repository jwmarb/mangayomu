import Animated from 'react-native-reanimated';
import { SectionList } from 'react-native';

const AnimatedSectionList = Animated.createAnimatedComponent(
  SectionList,
) as typeof SectionList;

export default AnimatedSectionList;
