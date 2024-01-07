import Stack from '@components/Stack';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import ImageCaching from '@screens/Performance/components/ImageCaching';
import Animated from 'react-native-reanimated';

export default function Performance(
  props: ReturnType<typeof useCollapsibleHeader>,
) {
  const { onScroll, scrollViewStyle, contentContainerStyle } = props;
  return (
    <Animated.ScrollView
      onScroll={onScroll}
      style={scrollViewStyle}
      contentContainerStyle={contentContainerStyle}
    >
      <Stack space="s" mx="m">
        <ImageCaching />
      </Stack>
    </Animated.ScrollView>
  );
}
