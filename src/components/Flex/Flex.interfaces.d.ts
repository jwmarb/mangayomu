import { ContainerProps } from '@components/Container/Container.interfaces';
import { FlexStyle } from 'react-native';

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
  wrap?: boolean;
};

export type FlexProps = FlexBaseProps &
  (
    | {
        container?: false;
      }
    | ({ container?: true } & ContainerProps)
  );
