import { ListBase } from '@components/List/List.base';
import React from 'react';
import { ViewProps } from 'react-native';

const List: React.FC<ViewProps> = (props) => {
  const { children, ...rest } = props;
  return <ListBase {...(rest as any)}>{children}</ListBase>;
};

export default List;
