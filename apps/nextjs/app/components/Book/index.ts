import { Manga } from '@mangayomu/mangascraper';
import Skeleton from './skeleton';
import BaseBook from './Book';
const Book = BaseBook as typeof BaseBook & { Skeleton: typeof Skeleton };
Book.Skeleton = Skeleton;

export default Book;
export interface BookProps {
  manga: Manga;
}
