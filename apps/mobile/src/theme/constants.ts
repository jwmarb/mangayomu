import { moderateScale } from 'react-native-size-matters';

export const BOOK_DIMENSIONS = {
  width: moderateScale(110),
  height: moderateScale(205),
};

export const BOOK_DIMENSIONS_RATIO =
  BOOK_DIMENSIONS.width / BOOK_DIMENSIONS.height;

export const UNFINISHED_MANGA_HEIGHT = moderateScale(128);
