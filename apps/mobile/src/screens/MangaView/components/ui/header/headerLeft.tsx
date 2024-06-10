import { useNavigation } from '@react-navigation/native';
import { AnimatedHeaderComponentProps } from '@/components/composites/Header/Header';
import { AnimatedIcon } from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import useHeaderTextColor from '@/screens/MangaView/hooks/useHeaderTextColor';

export default function headerLeft({
  scrollOffset,
}: AnimatedHeaderComponentProps) {
  const style = useHeaderTextColor(scrollOffset);
  const navigation = useNavigation();
  function handleOnPress() {
    if (navigation.canGoBack()) navigation.goBack();
  }
  return (
    <IconButton
      onPress={handleOnPress}
      icon={<AnimatedIcon type="icon" name="arrow-left" style={style} />}
    />
  );
}
