import Animated, { AnimatedScrollViewProps } from 'react-native-reanimated';
import { FlatListProps, SectionListProps } from 'react-native';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { styles } from '@/components/primitives/Screen/styles';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import AnimatedSectionList from '@/components/animated/SectionList';

export type ScreenProps = AnimatedScrollViewProps & {
  collapsible: ReturnType<typeof useCollapsibleHeader>;
  contrast?: boolean;
};

function Screen(props: ScreenProps) {
  const {
    collapsible,
    contentContainerStyle: styleProp,
    contrast: contrastProp,
    ...rest
  } = props;
  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);
  const scrollViewStyles = [style.contentContainerStyle, styleProp];

  return (
    <Animated.ScrollView
      {...rest}
      contentContainerStyle={scrollViewStyles}
      onScroll={collapsible.onScroll}
    />
  );
}

Screen.FlatList = function <T>(
  props: FlatListProps<T> & Omit<ScreenProps, keyof AnimatedScrollViewProps>,
) {
  const {
    collapsible,
    contrast: contrastProp,
    contentContainerStyle: contentContainerStyleProp,
    ...rest
  } = props;

  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);

  return (
    <Animated.FlatList
      onScroll={collapsible.onScroll}
      contentContainerStyle={[
        style.contentContainerStyle,
        contentContainerStyleProp,
      ]}
      {...rest}
    />
  );
};

Screen.SectionList = function <T>(
  props: SectionListProps<T> & Omit<ScreenProps, keyof AnimatedScrollViewProps>,
) {
  const { collapsible, contrast: contrastProp, ...rest } = props;

  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);

  return (
    <AnimatedSectionList
      onScroll={collapsible.onScroll}
      contentContainerStyle={style.contentContainerStyle}
      {...rest}
    />
  );
};

export default Screen;
