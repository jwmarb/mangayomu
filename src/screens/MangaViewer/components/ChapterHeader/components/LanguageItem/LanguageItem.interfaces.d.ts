import { ISOLangCode } from '@utils/languageCodes';

export interface LanguageItemProps {
  selected: boolean;
  onSelect: (x: ISOLangCode) => void;
  isoCode: ISOLangCode;
}
