import { moderateScale } from 'react-native-size-matters';

export const BOOK_DIMENSIONS = {
  width: moderateScale(110),
  height: moderateScale(205),
};

export const BOOK_DIMENSIONS_RATIO =
  BOOK_DIMENSIONS.width / BOOK_DIMENSIONS.height;

export const BOOK_COVER_HEIGHT = moderateScale(160);

export const UNFINISHED_MANGA_HEIGHT = moderateScale(128);
export const UNFINISHED_MANGA_WIDTH = moderateScale(267);

export const ACCORDION_SECTION_HEADER_HEIGHT = moderateScale(48);
export const ACCORDION_ITEM_HEIGHT = moderateScale(52);

export const OVERLAY_COLOR = 'rgba(128, 128, 128, 0.5)';
export const OVERLAY_TEXT_PRIMARY = 'rgba(255, 255, 255, 1)';
export const OVERLAY_TEXT_SECONDARY = 'rgba(255, 255, 255, 0.7)';
export const OVERLAY_SLIDER_HEIGHT = moderateScale(45);
export const OVERLAY_HEADER_HEIGHT = moderateScale(64);
export const OVERLAY_SLIDER_CIRCLE_RADIUS = moderateScale(11);
export const OVERLAY_SLIDER_CIRCLE_RIPPLE_RADIUS = moderateScale(16);
export const READER_NETWORK_TOAST_HEIGHT = moderateScale(24);

export const RADIO_BUTTON_BORDER_WIDTH = moderateScale(2);

export const DIVIDER_DEPTH = moderateScale(1.5);

export const LOADING_BAR_HEIGHT = moderateScale(3);
