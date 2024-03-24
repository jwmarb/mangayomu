import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Text from '@/components/primitives/Text';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import IconButton from '@/components/primitives/IconButton';
import Icon from '@/components/primitives/Icon';
import { CollapsibleHeaderOptions } from '@/hooks/useCollapsibleHeader';
import { styles } from '@/components/composites/Header/styles';

export type HeaderProps = NativeStackHeaderProps &
  CollapsibleHeaderOptions & {
    translateY: SharedValue<number>;
    backgroundColor: SharedValue<string>;
  };

export default function Header(props: HeaderProps) {
  const {
    back,
    showHeaderLeft = true,
    headerLeft,
    showHeaderCenter = true,
    showHeaderRight = true,
    headerRight,
    headerCenter,
    title,
    navigation,
    translateY,
    backgroundColor,
    headerCenterStyle: headerCenterStyleProp,
    headerLeftStyle: headerLeftStyleProp,
    headerRightStyle: headerRightStyleProp,
    headerStyle: headerStyleProp,
    shrinkLeftAndRightHeaders = false,
  } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
    transform: [{ translateY: translateY.value }],
  }));

  const safeAreaViewStyle = [style.container, animatedStyle, headerStyleProp];
  const headerLeftStyle = [
    shrinkLeftAndRightHeaders ? style.itemShrink : style.item,
    style.headerLeft,
    headerLeftStyleProp,
  ];
  const headerCenterStyle = [style.item, headerCenterStyleProp];
  const headerRightStyle = [
    shrinkLeftAndRightHeaders ? style.itemShrink : style.item,
    headerRightStyleProp,
  ];
  function handleOnBack() {
    if (navigation.canGoBack()) navigation.goBack();
  }
  return (
    <Animated.View style={safeAreaViewStyle}>
      {showHeaderLeft && (
        <SafeAreaView edges={['top']} style={headerLeftStyle}>
          {back != null && (
            <IconButton
              icon={<Icon type="icon" name="arrow-left" />}
              onPress={handleOnBack}
            />
          )}
          {headerLeft}
        </SafeAreaView>
      )}
      {showHeaderCenter && (
        <SafeAreaView edges={['top']} style={headerCenterStyle}>
          {!headerCenter && (
            <Text
              alignment={
                (showHeaderLeft && showHeaderRight) ||
                (!showHeaderLeft && !showHeaderRight)
                  ? 'center'
                  : 'left'
              }
              variant="h4"
              bold
            >
              {title}
            </Text>
          )}
          {headerCenter}
        </SafeAreaView>
      )}
      {showHeaderRight && (
        <SafeAreaView edges={['top']} style={headerRightStyle}>
          {headerRight}
        </SafeAreaView>
      )}
    </Animated.View>
  );
}
