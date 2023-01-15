import {
  OverloadedSetting,
  ReaderScreenOrientation,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { Manga } from '@services/scraper/scraper.interfaces';

export interface OverlayFooterProps {
  manga: Manga;
}
