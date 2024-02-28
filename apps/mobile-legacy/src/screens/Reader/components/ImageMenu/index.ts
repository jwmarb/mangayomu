export { default } from './ImageMenu';
export interface ImageMenuProps {
  pageInDisplay: {
    parsedKey: string;
    url: string;
    chapter: string;
  } | null;
}

export interface ImageMenuMethods {
  setImageMenuPageKey: (pageKey: string) => void;
}
