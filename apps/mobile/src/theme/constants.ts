import { moderateScale } from 'react-native-size-matters';

export const BOOK_DIMENSIONS = {
  width: moderateScale(110),
  height: moderateScale(205),
};

export const BOOK_DIMENSIONS_RATIO =
  BOOK_DIMENSIONS.width / BOOK_DIMENSIONS.height;

export const UNFINISHED_MANGA_HEIGHT = moderateScale(128);

export const ACCORDION_SECTION_HEADER_HEIGHT = moderateScale(48);
export const ACCORDION_ITEM_HEIGHT = moderateScale(52);

export const OVERLAY_COLOR = 'rgba(128, 128, 128, 0.5)';
export const OVERLAY_TEXT_PRIMARY = { custom: 'rgba(255, 255, 255, 1)' };
export const OVERLAY_TEXT_SECONDARY = { custom: 'rgba(255, 255, 255, 0.7)' };
