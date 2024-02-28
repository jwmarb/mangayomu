import { Image, View } from 'react-native';
import React, { useId } from 'react';
import useImageCaching from '@components/ImprovedImage/useImageCaching';
import { ImprovedImageProps } from '@components/ImprovedImage';

function ImprovedImage(
  props: ImprovedImageProps,
  ref: React.ForwardedRef<Image>,
) {
  const [uri, rest] = useImageCaching(props);
  const id = useId();
  if (uri == null) return <View key={id} ref={ref} {...rest} />;
  return <Image key={id} ref={ref} source={uri} {...rest} />;
}

export default React.forwardRef(ImprovedImage);
