import { BOOK_COVER_RATIO } from '@components/Book';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { moderateScale } from 'react-native-size-matters';

export enum ReadingDirection {
  LEFT_TO_RIGHT = 'Left to right',
  RIGHT_TO_LEFT = 'Right to left',
  VERTICAL = 'Vertical',
  WEBTOON = 'Webtoon',
}

export enum ImageScaling {
  SMART_FIT = 'Smart fit',
  FIT_SCREEN = 'Fit screen',
  FIT_WIDTH = 'Fit width',
  FIT_HEIGHT = 'Fit height',
}

export enum ZoomStartPosition {
  AUTOMATIC = 'Automatic',
  LEFT = 'Left',
  RIGHT = 'Right',
  CENTER = 'Center',
}

export enum ReaderScreenOrientation {
  FREE = 'Free',
  PORTRAIT = 'Portrait',
  LANDSCAPE = 'Landscape',
}

export enum ReaderBackgroundColor {
  GRAY = 'Gray',
  BLACK = 'Black',
  WHITE = 'White',
}

export enum BookStyle {
  CLASSIC,
  TACHIYOMI,
  MANGAROCK,
}

export enum TitleAlignment {
  CENTER = 'center',
  START = 'left',
  END = 'right',
}

export interface SettingsState {
  cloud: {
    enabled: boolean;
  };
  /**
   * This is global settings. Reader settings should be stored in MangaSchema
   */
  reader: {
    lockOrientation: ReaderScreenOrientation; // this property should be local only
    backgroundColor: ReaderBackgroundColor;
    showPageNumber: boolean;
    notifyOnLastChapter: boolean;
    imageScaling: ImageScaling;
    readingDirection: ReadingDirection;
    zoomStartPosition: ZoomStartPosition;
  };
  book: {
    width: number;
    height: number;
    coverHeight: number;
    autoHeight: boolean;
    style: BookStyle;
    title: {
      bold: boolean;
      size: number;
      letterSpacing: number;
      autoLetterSpacing: boolean;
      alignment: TitleAlignment;
    };
  };
}

export const AUTO_HEIGHT_SCALAR = 0.78048780487;

const initialSettingsState: SettingsState = {
  cloud: {
    enabled: true,
  },
  reader: {
    lockOrientation: ReaderScreenOrientation.FREE,
    backgroundColor: ReaderBackgroundColor.BLACK,
    showPageNumber: true,
    notifyOnLastChapter: true,
    imageScaling: ImageScaling.SMART_FIT,
    readingDirection: ReadingDirection.RIGHT_TO_LEFT,
    zoomStartPosition: ZoomStartPosition.AUTOMATIC,
  },
  book: {
    width: moderateScale(110),
    height: moderateScale(205),
    coverHeight: moderateScale(160),
    autoHeight: true,
    style: BookStyle.CLASSIC,
    title: {
      size: moderateScale(12),
      bold: false,
      letterSpacing: -0.4,
      autoLetterSpacing: true,
      alignment: TitleAlignment.START,
    },
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    toggleCloudSync: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload != null) state.cloud.enabled = action.payload;
      else state.cloud.enabled = !state.cloud.enabled;
    },
    setBookDimensions: (
      state,
      action: PayloadAction<{ width?: number; height?: number }>,
    ) => {
      if (action.payload.width != null) state.book.width = action.payload.width;
      if (action.payload.height != null) {
        state.book.height = action.payload.height;
        state.book.coverHeight = action.payload.height * BOOK_COVER_RATIO;
      }
      // if (state.book.title.autoLetterSpacing) {
      //   state.book.title.letterSpacing = -state.book.width / moderateScale(30);
      // }
      // if (state.book.autoHeight) {
      //   state.book.height = state.book.width * AUTO_HEIGHT_SCALAR;
      // }
    },
    toggleAutoLetterSpacing: (state) => {
      state.book.title.autoLetterSpacing = !state.book.title.autoLetterSpacing;
    },
    setBookLetterSpacing: (state, action: PayloadAction<number>) => {
      state.book.title.letterSpacing = action.payload;
    },
    toggleAutoBookHeight: (state) => {
      state.book.autoHeight = !state.book.autoHeight;
      if (state.book.autoHeight) {
        state.book.height = state.book.width * AUTO_HEIGHT_SCALAR;
      }
    },
    toggleBoldTitleFont: (state) => {
      state.book.title.bold = !state.book.title.bold;
    },
    setTitleAlignment: (state, action: PayloadAction<TitleAlignment>) => {
      state.book.title.alignment = action.payload;
    },
    setTitleFontSize: (state, action: PayloadAction<number>) => {
      state.book.title.size = action.payload;
    },
    setBookStyle: (state, action: PayloadAction<BookStyle>) => {
      state.book.style = action.payload;
    },
  },
});

export const {
  toggleCloudSync,
  setBookDimensions,
  toggleAutoLetterSpacing,
  setBookLetterSpacing,
  toggleAutoBookHeight,
  toggleBoldTitleFont,
  setTitleAlignment,
  setTitleFontSize,
  setBookStyle,
} = settingsSlice.actions;

export default settingsSlice.reducer;
