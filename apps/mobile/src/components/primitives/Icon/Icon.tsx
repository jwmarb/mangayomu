import MaterialCommunityIconNames from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Image,
  ImageStyle,
  StyleProp,
  TextProps,
  TextStyle,
} from 'react-native';
import { sizes } from '@/components/primitives/Icon/styles';
import { IconSizes, TextColors } from '@/components/primitives/types';
import { colors } from '@/components/primitives/Text/styles';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';

export type IconProps = BaseProps & (FontIconProps | ImageIconProps);

type BaseProps = Pick<TextProps, 'style'> & {
  color?: TextColors;
  size?: 'large' | 'medium' | 'small';
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

export default function Icon(props: IconProps) {
  const {
    color: colorProp = 'textPrimary',
    size: sizeProp = 'medium',
    contrast: contrastProp,
    style: styleProp,
    ...rest
  } = props;
  const contrast = useContrast(contrastProp);
  const size = composedSizes[rest.type][sizeProp];
  const color = useStyles(colors, contrast)[colorProp];
  const style =
    rest.type === 'icon' ? [size, color, styleProp] : [size, styleProp];
  switch (rest.type) {
    case 'icon':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (
        <MaterialCommunityIcons
          {...rest}
          name={rest.name}
          style={style as any}
        />
      );
    case 'image':
      return (
        <Image
          {...rest}
          src={rest.uri}
          style={style as StyleProp<ImageStyle>[]}
        />
      );
  }
}
