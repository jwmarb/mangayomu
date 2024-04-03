import { useQuery } from '@tanstack/react-query';
import {
  ImageBackground as NativeImageBackground,
  ImageBackgroundProps as NativeImageBackgroundProps,
} from 'react-native';
import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import AnimatedNativeImageBackground from '@/components/animated/NativeImageBackground';
import { downloadImage } from '@/utils/image';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/components/primitives/Image/styles';

export type ImageBackgroundProps = NativeImageBackgroundProps & {
  contrast?: boolean;
};

function ImageBackground(
  props: ImageBackgroundProps,
  ref: React.ForwardedRef<NativeImageBackground>,
) {
  const { source, contrast: contrastProp, ...rest } = props;
  const { data, error, isLoading } = useQuery({
    queryKey: [source],
    queryFn: () =>
      source != null &&
      typeof source === 'object' &&
      'uri' in source &&
      source.uri != null
        ? downloadImage(source.uri)
        : source,
  });
  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);

  const loadingStyle = [style.loading, rest.style];

  if (isLoading)
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        {...rest}
        style={loadingStyle}
      />
    );

  if (error)
    return (
      <AnimatedNativeImageBackground
        ref={ref}
        entering={FadeIn}
        exiting={FadeOut}
        source={require('@/assets/no-image-available.png')}
        {...rest}
      />
    );

  if (data)
    return (
      <AnimatedNativeImageBackground
        entering={FadeIn}
        exiting={FadeOut}
        ref={ref}
        source={data}
        {...rest}
      />
    );

  return null;
}

export default React.forwardRef(ImageBackground);
