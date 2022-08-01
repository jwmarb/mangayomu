import {
  ImageScaling,
  ZoomStartPosition,
  ReaderScreenOrientation,
  OverloadedSetting,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';

export type ReaderSettingProfileReducerState = Record<string, ReaderSettingProfile>;

export type ReaderSettingProfile = {
  readingDirection: ReaderDirection | OverloadedSetting;
  orientation: ReaderScreenOrientation | OverloadedSetting;
  imageScaling: ImageScaling | OverloadedSetting;
  zoomStartPosition: ZoomStartPosition | OverloadedSetting;
};

export type GlobalReadingSettingProfile = {
  readingDirection: ReaderDirection;
  orientation: ReaderScreenOrientation;
  imageScaling: ImageScaling;
  zoomStartPosition: ZoomStartPosition;
};

export type ReaderSettingProfileReducerAction =
  | {
      type: 'SET_DEVICE_ORIENTATION_FOR_SERIES';
      mangaKey: string;
      orientation: ReaderScreenOrientation | OverloadedSetting;
    }
  | { type: 'SET_IMAGE_SCALING_FOR_SERIES'; mangaKey: string; imageScaling: ImageScaling | OverloadedSetting }
  | {
      type: 'SET_ZOOM_START_POSITION_FOR_SERIES';
      mangaKey: string;
      zoomStartPosition: ZoomStartPosition | OverloadedSetting;
    }
  | {
      type: 'SET_READER_DIRECTION_FOR_SERIES';
      mangaKey: string;
      readerDirection: ReaderDirection | OverloadedSetting;
    }
  | { type: 'OPEN_READER'; manga: Manga; chapter: ReadingChapterInfo };
