import Animated, { AnimatedScrollViewProps } from 'react-native-reanimated';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { styles } from '@/components/primitives/Screen/styles';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';

export type ScreenProps = AnimatedScrollViewProps & {
  collapsible: ReturnType<typeof useCollapsibleHeader>;
  contrast?: boolean;
};

export default function Screen(props: ScreenProps) {
  const {
    collapsible,
    style: styleProp,
    contrast: contrastProp,
    ...rest
  } = props;
  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);
  const scrollViewStyles = [style.contentContainerStyle, styleProp];

  return (
    <Animated.ScrollView
      {...rest}
      style={scrollViewStyles}
      onScroll={collapsible.onScroll}
    />
  );
}
