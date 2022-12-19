import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import {
  ImageScaling,
  ZoomStartPosition,
  ReaderScreenOrientation,
  OverloadedSetting,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { Manga } from '@services/scraper/scraper.interfaces';

export type ReaderSettingProfileReducerState = Record<string, ReaderSettingProfile>;

export type ReaderSettingProfile = {
  readingDirection: ReaderDirection | OverloadedSetting;
  orientation: ReaderScreenOrientation | OverloadedSetting;
  imageScaling: ImageScaling | OverloadedSetting;
  zoomStartPosition: ZoomStartPosition | OverloadedSetting;
  shortChapters: boolean | OverloadedSetting;
};

export type GlobalReadingSettingProfile = {
  readingDirection: ReaderDirection;
  orientation: ReaderScreenOrientation;
  imageScaling: ImageScaling;
  zoomStartPosition: ZoomStartPosition;
  shortChapters: boolean;
};

export type ToggleReaderSettingProfileKeys = keyof {
  [K in keyof GlobalReadingSettingProfile as GlobalReadingSettingProfile[K] extends boolean ? K : never]: boolean;
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
  | { type: 'OPEN_READER'; manga: Manga; chapter: ReadingChapterInfo }
  | {
      type: 'TOGGLE_READER_SETTING_PROFILE';
      mangaKey: string;
      booleanKey: ToggleReaderSettingProfileKeys;
      value?: boolean | OverloadedSetting;
    };
