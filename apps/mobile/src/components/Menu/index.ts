import type { MenuItemProps } from '@components/Menu/Item';
import React from 'react';
import { register } from 'react-native-bundle-splitter';
// export { default as MenuItem } from './Item';
// export { default as Menu } from './Menu';
export const Menu = register<MenuProps>({ loader: () => import('./Menu') });
export const MenuItem = register({
  loader: () => import('./Item'),
}) as unknown as <T>(props: MenuItemProps<T>) => React.JSX.Element;

export interface MenuProps extends React.PropsWithChildren {
  trigger: React.ReactElement<unknown>;
  title?: 'Actions' | 'Options';
}
