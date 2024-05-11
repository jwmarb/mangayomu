import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image as NativeImage } from 'react-native';
import { ImageProps as NativeImageProps } from 'react-native';
import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { downloadImage } from '@/utils/image';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/components/primitives/Image/styles';

type ImageProps = NativeImageProps & {
  contrast?: boolean;
};

function Image(props: ImageProps, ref: React.ForwardedRef<NativeImage>) {
  const { source, contrast: contrastProp, ...rest } = props;
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryKey: [source],
    queryFn: () =>
      source != null &&
      typeof source === 'object' &&
      'uri' in source &&
      source.uri != null
        ? downloadImage(source.uri)
        : source,
    initialData: queryClient.getQueryCache().find({ queryKey: [source] })?.state
      .data,
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
      <Animated.Image
        ref={ref}
        entering={FadeIn}
        exiting={FadeOut}
        source={require('@/assets/no-image-available.png')}
        {...rest}
      />
    );

  if (data)
    return (
      <Animated.Image
        entering={FadeIn}
        exiting={FadeOut}
        ref={ref}
        source={data}
        {...rest}
      />
    );

  return null;
}

export default React.forwardRef(Image);
