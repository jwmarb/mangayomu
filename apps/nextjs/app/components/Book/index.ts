import { Manga } from '@mangayomu/mangascraper';
import Skeleton from './skeleton';
import BaseBook from './Book';
import BookList from '@app/components/Book/List';
const Book = BaseBook as typeof BaseBook & {
  Skeleton: typeof Skeleton;
  List: typeof BookList;
};
Book.Skeleton = Skeleton;
Book.List = BookList;

export default Book;
export interface BookProps {
  manga: Manga;
}
