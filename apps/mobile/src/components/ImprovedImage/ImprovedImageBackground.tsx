import { ImprovedImageProps } from '@components/ImprovedImage';
import useImageCaching from '@components/ImprovedImage/useImageCaching';
import { useId } from 'react';
import { ImageBackground, View } from 'react-native';

export default function ImprovedImageBackground(
  props: React.PropsWithChildren<ImprovedImageProps>,
) {
  const [uri, rest] = useImageCaching(props);
  const id = useId();
  if (uri == null) return <View key={id} {...rest} />;
  return <ImageBackground key={id} source={uri} {...rest} />;
}
