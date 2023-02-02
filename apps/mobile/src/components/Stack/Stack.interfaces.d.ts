import {
  BorderModel,
  BoxModel,
  Debuggable,
  DimensionsModel,
  FlexBoxModel,
  PositionModel,
} from '@components/Box/Box.interfaces';
import { Spacing } from '@mangayomu/theme';
import { ViewStyle } from 'react-native/types';

export interface StackProps
  extends BoxModel,
    FlexBoxModel,
    Debuggable,
    PositionModel,
    DimensionsModel,
    BorderModel {
  space?: Spacing | number | { x?: Spacing | number; y?: Spacing | number };
}
