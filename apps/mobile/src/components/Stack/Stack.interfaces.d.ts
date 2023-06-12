import {
  BorderModel,
  BoxModel,
  BoxProps,
  Debuggable,
  DimensionsModel,
  FlexBoxModel,
  PositionModel,
} from '@components/Box/Box.interfaces';
import { ButtonColors, Spacing } from '@mangayomu/theme';

export interface StackProps
  extends BoxModel,
    FlexBoxModel,
    Debuggable,
    PositionModel,
    DimensionsModel,
    BorderModel {
  space?: Spacing | number | { x?: Spacing | number; y?: Spacing | number };
  // eslint-disable-next-line @typescript-eslint/ban-types
  'background-color'?: 'paper' | 'default' | ButtonColors | (string & {});
}
