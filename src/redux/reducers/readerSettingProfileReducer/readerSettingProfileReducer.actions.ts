import {
  ImageScaling,
  ReaderScreenOrientation,
  ZoomStartPosition,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { OverloadedSetting } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { AppDispatch } from '@redux/store';

export const setOrientationForSeries = (mangaKey: string, orientation: ReaderScreenOrientation | OverloadedSetting) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_DEVICE_ORIENTATION_FOR_SERIES', mangaKey, orientation });
  };
};

export const setReaderDirectionForSeries = (mangaKey: string, direction: ReaderDirection | OverloadedSetting) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_READER_DIRECTION_FOR_SERIES', mangaKey, readerDirection: direction });
  };
};

export const setZoomStartPositionForSeries = (
  mangaKey: string,
  zoomStartPosition: ZoomStartPosition | OverloadedSetting
) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_ZOOM_START_POSITION_FOR_SERIES', mangaKey, zoomStartPosition });
  };
};

export const setImageScalingForSeries = (mangaKey: string, imageScaling: ImageScaling | OverloadedSetting) => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: 'SET_IMAGE_SCALING_FOR_SERIES', mangaKey, imageScaling });
  };
};
