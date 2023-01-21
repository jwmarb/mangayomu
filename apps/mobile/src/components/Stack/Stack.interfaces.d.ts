import { BoxModel, FlexBoxModel } from '@components/Box/Box.interfaces';
import { Spacing } from '@mangayomu/theme';
import { ViewStyle } from 'react-native/types';

export interface StackProps extends BoxModel, FlexBoxModel {
  space?: Spacing | number | { x?: Spacing | number; y?: Spacing | number };
}
