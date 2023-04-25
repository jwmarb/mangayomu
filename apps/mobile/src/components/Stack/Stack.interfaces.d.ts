import {
  BorderModel,
  BoxModel,
  Debuggable,
  DimensionsModel,
  FlexBoxModel,
  PositionModel,
} from '@components/Box/Box.interfaces';
import { Spacing } from '@mangayomu/theme';

export interface StackProps
  extends BoxModel,
    FlexBoxModel,
    Debuggable,
    PositionModel,
    DimensionsModel,
    BorderModel {
  space?: Spacing | number | { x?: Spacing | number; y?: Spacing | number };
}
