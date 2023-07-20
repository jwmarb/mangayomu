import { BOOK_COVER_RATIO } from '@components/Book';
import { IMangaSchema } from '@database/schemas/Manga';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { moderateScale } from 'react-native-size-matters';
import React from 'react';
import useCombinedMangaWithLocal from '@hooks/useCombinedMangaWithLocal';

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

export enum ReaderImageComponent {
  WEBVIEW = 'WebView',
  IMAGE = 'Image',
  FAST_IMAGE = 'FastImage',
  AUTO = 'Auto (recommended)',
}

export enum AutoFetchType {
  ALWAYS = 'Always',
  WIFI_ONLY = 'Wi-Fi only',
  NEVER = 'Never',
}

export enum AutoFetchThreshold {
  AT_START = 'From the start of a chapter',
  AT_END = 'From the end of a chapter',
  IMMEDIATELY = 'No threshold, fetch immediately',
}

export interface SettingsState {
  history: {
    incognito: boolean;
  };
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
    automaticallyFetchNextChapter: {
      type: AutoFetchType;
      thresholdPosition: AutoFetchThreshold;
      pageThreshold: number;
    };
    imageScaling: ImageScaling;
    readingDirection: ReadingDirection;
    zoomStartPosition: ZoomStartPosition;
    advanced: {
      imageComponent: ReaderImageComponent;
    };
  };
  book: {
    width: number;
    height: number;
    coverHeight: number;
    autoHeight: boolean;
    style: BookStyle;
    paddingHorizontal: number; // TACHIYOMI STYLE ONLY
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
  history: {
    incognito: false,
  },
  cloud: {
    enabled: true,
  },
  reader: {
    lockOrientation: ReaderScreenOrientation.FREE,
    backgroundColor: ReaderBackgroundColor.BLACK,
    showPageNumber: true,
    notifyOnLastChapter: true,
    automaticallyFetchNextChapter: {
      type: AutoFetchType.ALWAYS,
      thresholdPosition: AutoFetchThreshold.AT_END,
      pageThreshold: 5,
    },
    imageScaling: ImageScaling.SMART_FIT,
    readingDirection: ReadingDirection.RIGHT_TO_LEFT,
    zoomStartPosition: ZoomStartPosition.AUTOMATIC,
    advanced: {
      imageComponent: ReaderImageComponent.AUTO,
    },
  },
  book: {
    width: moderateScale(110),
    height: moderateScale(205),
    coverHeight: moderateScale(160),
    autoHeight: true,
    style: BookStyle.CLASSIC,
    paddingHorizontal: moderateScale(4),
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
    toggleIncognitoMode: (state) => {
      state.history.incognito = !state.history.incognito;
    },
    setReaderImageComponent: (
      state,
      action: PayloadAction<ReaderImageComponent>,
    ) => {
      if (state.reader.advanced == null)
        state.reader.advanced = { imageComponent: action.payload };
      state.reader.advanced.imageComponent = action.payload;
    },

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
        state.book.paddingHorizontal = Math.max(
          moderateScale(4),
          action.payload.height * 0.025,
        );
      }

      // if (state.book.title.autoLetterSpacing) {
      //   state.book.title.letterSpacing = -state.book.width / moderateScale(30);
      // }
      // if (state.book.autoHeight) {
      //   state.book.height = state.book.width * AUTO_HEIGHT_SCALAR;
      // }
    },
    setGlobalReadingDirection: (
      state,
      action: PayloadAction<ReadingDirection>,
    ) => {
      state.reader.readingDirection = action.payload;
    },
    setLockedDeviceOrientation: (
      state,
      action: PayloadAction<ReaderScreenOrientation>,
    ) => {
      state.reader.lockOrientation = action.payload;
    },
    setGlobalZoomStartPosition: (
      state,
      action: PayloadAction<ZoomStartPosition>,
    ) => {
      state.reader.zoomStartPosition = action.payload;
    },
    setGlobalImageScaling: (state, action: PayloadAction<ImageScaling>) => {
      state.reader.imageScaling = action.payload;
    },
    toggleShowPageNumber: (state) => {
      state.reader.showPageNumber = !state.reader.showPageNumber;
    },
    toggleNotifyOnLastChapter: (state) => {
      state.reader.notifyOnLastChapter = !state.reader.notifyOnLastChapter;
    },
    toggleAutoLetterSpacing: (state) => {
      state.book.title.autoLetterSpacing = !state.book.title.autoLetterSpacing;
    },
    setBookLetterSpacing: (state, action: PayloadAction<number>) => {
      state.book.title.letterSpacing = action.payload;
    },
    setReaderBackgroundColor: (
      state,
      action: PayloadAction<ReaderBackgroundColor>,
    ) => {
      state.reader.backgroundColor = action.payload;
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
    setAutoFetch: (state, action: PayloadAction<AutoFetchType>) => {
      state.reader.automaticallyFetchNextChapter.type = action.payload;
    },
    setAutoFetchThresholdPosition: (
      state,
      action: PayloadAction<AutoFetchThreshold>,
    ) => {
      state.reader.automaticallyFetchNextChapter.thresholdPosition =
        action.payload;
    },
    setAutoFetchPageThreshold: (state, action: PayloadAction<number>) => {
      state.reader.automaticallyFetchNextChapter.pageThreshold = action.payload;
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
  setGlobalReadingDirection,
  setLockedDeviceOrientation,
  setGlobalZoomStartPosition,
  setGlobalImageScaling,
  toggleNotifyOnLastChapter,
  setReaderBackgroundColor,
  toggleShowPageNumber,
  setReaderImageComponent,
  toggleIncognitoMode,
  setAutoFetch,
  setAutoFetchThresholdPosition,
  setAutoFetchPageThreshold,
} = settingsSlice.actions;

export function useReaderSetting<
  T extends keyof IMangaSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Payload extends ((val: IMangaSchema[T]) => any) | string,
>(
  key: T,
  globalSettingValue: Exclude<IMangaSchema[T], 'Use global setting'>,
  payload: Payload,
): Payload extends string
  ? [IMangaSchema[T], (val: IMangaSchema[T]) => void]
  : [
      Exclude<IMangaSchema[T], 'Use global setting'>,
      (val: Exclude<IMangaSchema[T], 'Use global setting'>) => void,
    ] {
  if (typeof payload === 'function') return [globalSettingValue, payload];
  if (payload == null) {
    console.warn(
      `Undefined key was passed into useReaderSetting. The key that was supposed to be used was ${key}`,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [globalSettingValue, payload] as any;
  }
  const manga = useCombinedMangaWithLocal(payload, true);
  const setter = React.useCallback(
    (val: IMangaSchema[T]) => {
      manga.update((draft) => {
        (draft as IMangaSchema)[key] = val;
      });
    },
    [manga, key],
  );
  if (manga == null) {
    console.warn(
      `The provided key returned an undefined value.\nmangaKey = ${payload}`,
    );
    return [globalSettingValue, setter];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [manga[key], setter] as any;
}

export default settingsSlice.reducer;
