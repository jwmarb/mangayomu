import { Manga } from '@mangayomu/mangascraper';
import Skeleton from './skeleton';
import BaseBook from './Book';
import BookList from '@app/components/Book/List';
import _Cover, { SkeletonCover } from '@app/components/Book/cover';
const Cover = _Cover as typeof _Cover & { Skeleton: typeof SkeletonCover };
Cover.Skeleton = SkeletonCover;
const Book = BaseBook as typeof BaseBook & {
  Skeleton: typeof Skeleton;
  List: typeof BookList;
  Cover: typeof Cover;
};
Book.Skeleton = Skeleton;
Book.List = BookList;
Book.Cover = Cover;

export default Book;
export interface BookProps {
  manga: Manga;
}
