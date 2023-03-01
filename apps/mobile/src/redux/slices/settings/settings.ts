import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface SettingsState {
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
}

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
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    toggleCloudSync: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload != null) state.cloud.enabled = action.payload;
      else state.cloud.enabled = !state.cloud.enabled;
    },
  },
});

export const { toggleCloudSync } = settingsSlice.actions;

export default settingsSlice.reducer;
