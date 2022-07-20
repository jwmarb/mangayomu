import { ContainerProps } from '@components/Container/Container.interfaces';
import { FlexStyle, ViewProps } from 'react-native';

type FlexBaseProps = {
  justifyContent?: FlexStyle['justifyContent'];
  alignItems?: FlexStyle['alignItems'];
  direction?: FlexStyle['flexDirection'];
  grow?: boolean;
  shrink?: boolean;
  growMax?: number | string;
  debug?: boolean;
  spacing?: number;
  fullWidth?: boolean;
  wrap?: boolean | FlexStyle['flexWrap'];
  fullHeight?: boolean;
} & ViewProps;

export type FlexProps = FlexBaseProps &
  (
    | {
        container?: false;
      }
    | ({ container?: true } & ContainerProps)
  );
