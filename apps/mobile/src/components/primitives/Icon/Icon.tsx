import MaterialCommunityIconNames from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Image,
  ImageStyle,
  StyleProp,
  TextProps,
  TextStyle,
} from 'react-native';
import React from 'react';
import Animated, { AnimatedProps } from 'react-native-reanimated';
import { sizes } from '@/components/primitives/Icon/styles';
import {
  IconSizes,
  TextColorTypes,
  TextColors,
} from '@/components/primitives/types';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import { composedColors } from '@/components/primitives/Text';

export type IconProps = BaseProps & (FontIconProps | ImageIconProps);

type BaseProps = Pick<TextProps, 'style'> & {
  color?: TextColors;
  colorType?: TextColorTypes;
  size?: 'large' | 'medium' | 'small' | number;
  contrast?: boolean;
  testID?: string;
};
type FontIconProps = {
  type: 'icon';
  name: keyof typeof MaterialCommunityIconNames;
};

type ImageIconProps = {
  type: 'image';
  uri: string;
};

export const composedSizes = (['icon', 'image'] as const).reduce(
  (prev, curr) => {
    prev[curr] = sizes(curr);
    return prev;
  },
  {} as Record<Pick<IconProps, 'type'>['type'], Record<IconSizes, TextStyle>>,
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Icon(props: IconProps, ref: React.ForwardedRef<any>) {
  const {
    color: colorProp = 'textPrimary',
    colorType = 'main',
    size: sizeProp = 'medium',
    contrast: contrastProp,
    style: styleProp,
    ...rest
  } = props;
  const contrast = useContrast(contrastProp);
  const size =
    typeof sizeProp === 'string'
      ? composedSizes[rest.type][sizeProp]
      : undefined;
  const color = useStyles(composedColors[colorType], contrast)[colorProp];
  const style =
    rest.type === 'icon' ? [size, color, styleProp] : [size, styleProp];
  switch (rest.type) {
    case 'icon':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (
        <MaterialCommunityIcons
          {...rest}
          ref={ref}
          name={rest.name}
          size={typeof sizeProp === 'number' ? sizeProp : undefined}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style={style as any}
        />
      );
    case 'image':
      return (
        <Image
          {...rest}
          ref={ref}
          src={rest.uri}
          style={style as StyleProp<ImageStyle>[]}
        />
      );
  }
}

const ForwardedIcon = React.forwardRef(Icon);

export const AnimatedIcon = Animated.createAnimatedComponent(
  ForwardedIcon,
) as React.FC<IconProps & AnimatedProps<IconProps>>;

export default ForwardedIcon as typeof Icon;
