export type BackgroundColor = 'default' | 'paper' | 'disabled';
export type ButtonColor = 'primary' | 'secondary';
export type TextColor =
  | 'text-primary'
  | 'text-secondary'
  | 'error'
  | 'hint'
  | 'overlay-primary'
  | 'overlay-secondary';
export type ButtonContrastColors =
  | `${ButtonColor}-contrast`
  | 'error-contrast'
  | 'icon-button-contrast';
export type ButtonVariant = 'contained' | 'outline' | 'text';
export type AppColor = TextColor | ButtonColor | BackgroundColor;
export type TextVariant =
  | 'header'
  | 'body'
  | 'button'
  | 'sm-label'
  | 'header-emphasized'
  | 'list-header'
  | 'sm-badge'
  | 'book-title';
