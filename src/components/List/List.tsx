import { ListBase } from '@components/List/List.base';
import React from 'react';

const List: React.FC = (props) => {
  const { children } = props;
  return <ListBase>{children}</ListBase>;
};

export default List;
