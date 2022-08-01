import { OverloadedSetting } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import {
  GlobalReadingSettingProfile,
  ReaderSettingProfile,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.interfaces';
import { AppState } from '@redux/store';
import { Manga } from '@services/scraper/scraper.interfaces';

export function getOrUseGlobalSetting<T extends keyof ReaderSettingProfile>(state: AppState, mangaKey: string, key: T) {
  return state.readerSetting[mangaKey][key] != null && state.readerSetting[mangaKey][key] !== OverloadedSetting.AUTO
    ? (state.readerSetting[mangaKey][key] as GlobalReadingSettingProfile[T])
    : state.settings.reader._global[key];
}
