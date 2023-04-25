export interface ImageMenuProps {
  pageInDisplay: {
    parsedKey: string;
    url: string;
    chapter: string;
  } | null;
}

export interface ImageMenuMethods {
  open: () => void;
}
