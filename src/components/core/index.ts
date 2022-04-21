export { default as Flex } from '../Flex';
export * from '../Typography';
export { default as Icon } from '../Icon';
export { default as Screen } from '../Screen';
export * from '../Screen';
export { default as Button } from '../Button';
export { default as ResponsiveImage } from '../ResponsiveImage';
export { default as Spacer } from '../Spacer';
export { default as IconButton } from '../IconButton';
export { Tabs as StackTabs } from '../Screen';
export { default as Genre } from '../Genre';
export { default as Category } from '../Category';
export { default as MangaComponent } from '../Manga';
import { MangaSkeleton } from '@components/Manga';
import { TypographySkeleton } from '@components/Typography';
import { ChapterSkeleton } from '@components/Chapter';
export const Skeleton = {
  MangaComponent: MangaSkeleton,
  Typography: TypographySkeleton,
  Chapter: ChapterSkeleton,
};
import { MangaPlaceholder } from '@components/Manga';
/**
 * The difference between Placeholder and Skeleton is that Placeholder is meant for lists
 */
export const Placeholder = {
  MangaComponent: MangaPlaceholder,
};

export { MangaCover } from '../Manga';
export * from '../Container';
export { default as Progress } from '../Progress';
export { default as Chapter } from '../Chapter';
export { default as FlatListScreen } from '../FlatListScreen';
export { default as RecyclerListViewScreen } from '../RecyclerListViewScreen';
export { default as TextField } from '../TextField';
export { default as Modal } from '../Modal';
