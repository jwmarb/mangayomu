import React from 'react';
export { default as MenuItem } from './Item';
export { default as Menu } from './Menu';

export interface MenuProps extends React.PropsWithChildren {
  trigger: React.ReactElement<unknown>;
  title?: 'Actions' | 'Options';
}
