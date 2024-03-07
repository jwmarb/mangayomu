export const APP_COLORS = ['primary', 'secondary'] as const;
export const TEXT_VARIANTS = [
  'h1',
  'h2',
  'h3',
  'body1',
  'body2',
  'button',
] as const;
export const TEXT_ALIGNMENTS = ['left', 'center', 'right'] as const;
export const BUTTON_VARIANTS = ['contained', 'outlined', 'text'] as const;
export const BUTTON_COLORS = [...APP_COLORS] as const;
export const TEXT_COLORS = [
  ...BUTTON_COLORS,
  'textPrimary',
  'textSecondary',
  'disabled',
] as const;

export type AppColor = (typeof APP_COLORS)[number];
export type ButtonVariants = (typeof BUTTON_VARIANTS)[number];
export type ButtonColors = (typeof BUTTON_COLORS)[number];
export type TextColors = (typeof TEXT_COLORS)[number];
export type TextVariants = (typeof TEXT_VARIANTS)[number];
export type TextAlignments = (typeof TEXT_ALIGNMENTS)[number];
