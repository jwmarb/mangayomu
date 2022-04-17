import { FlexStyle } from 'react-native';

export interface FlexProps {
  justifyContent?: FlexStyle['justifyContent'];
  alignItems?: FlexStyle['alignItems'];
  direction?: FlexStyle['flexDirection'];
  grow?: boolean;
  shrink?: boolean;
  growMax?: number | string;
  debug?: boolean;
  spacing?: number;
  fullWidth?: boolean;
}
