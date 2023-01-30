import React from 'react';

export interface MenuItemProps extends React.PropsWithChildren {
  onPress?: () => void;
}
