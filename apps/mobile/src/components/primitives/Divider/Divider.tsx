import { StyleProp, View, ViewStyle } from 'react-native';
import { styles } from '@/components/primitives/Divider/styles';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';

export type DividerProps = {
  orientation?: 'vertical' | 'horizontal';
  contrast?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Divider(props: DividerProps) {
  const {
    orientation = 'horizontal',
    contrast: contrastProp,
    style: styleProp,
  } = props;
  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);

  return <View style={[style[orientation], styleProp]} />;
}
