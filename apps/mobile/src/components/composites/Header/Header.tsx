import { View } from 'react-native';
import { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Text from '@/components/primitives/Text';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import IconButton from '@/components/primitives/IconButton';
import Icon from '@/components/primitives/Icon';
import { CollapsibleHeaderOptions } from '@/hooks/useCollapsibleHeader';
import AnimatedSafeAreaView from '@/components/animated/SafeAreaView';
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
  } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
    transform: [{ translateY: translateY.value }],
  }));

  const safeAreaViewStyle = [style.container, animatedStyle];
  const headerLeftStyle = [style.item, style.headerLeft];
  const headerCenterStyle = [style.item];
  const headerRightStyle = [style.item];
  function handleOnBack() {
    if (navigation.canGoBack()) navigation.goBack();
  }
  return (
    <AnimatedSafeAreaView style={safeAreaViewStyle} edges={['top']}>
      {showHeaderLeft && (
        <View style={headerLeftStyle}>
          {back != null && (
            <IconButton
              icon={<Icon type="icon" name="arrow-left" />}
              onPress={handleOnBack}
            />
          )}
          {headerLeft}
        </View>
      )}
      {showHeaderCenter && (
        <View style={headerCenterStyle}>
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
        </View>
      )}
      {showHeaderRight && <View style={headerRightStyle}>{headerRight}</View>}
    </AnimatedSafeAreaView>
  );
}
