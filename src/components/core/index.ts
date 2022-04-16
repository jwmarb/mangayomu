export { default as Flex } from '../Flex';
export * from '../Typography';
export { default as Icon } from '../Icon';
export { default as Screen } from '../Screen';
export { Header as StackHeader } from '../Screen';
export { default as Button } from '../Button';
export { default as ResponsiveImage } from '../ResponsiveImage';
export { default as Spacer } from '../Spacer';
export { default as IconButton } from '../IconButton';
export { Tabs as StackTabs } from '../Screen';
export { default as Genre } from '../Genre';
import { CategoryHeader } from '../CategoryHeader';
import { CategoryList } from '@components/CategoryList';
export const Category = {
  Header: CategoryHeader,
  FlatList: CategoryList,
};
