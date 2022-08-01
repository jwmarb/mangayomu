import { OverloadedSetting } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { ReaderSettingProfile } from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.interfaces';
import { AppState } from '@redux/store';
import { Manga } from '@services/scraper/scraper.interfaces';

export function getOrUseGlobalSetting<T extends keyof ReaderSettingProfile>(state: AppState, manga: Manga, key: T) {
  return state.readerSetting[manga.link][key] != null && state.readerSetting[manga.link][key] !== OverloadedSetting.AUTO
    ? state.readerSetting[manga.link][key]
    : state.settings.reader._global[key];
}
