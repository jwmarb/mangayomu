import React from 'react';

export interface PressableListItemProps extends React.PropsWithChildren {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconLeft?: React.ReactElement<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconRight?: React.ReactElement<any>;
  label: string;
  onPress?: () => void;
}
