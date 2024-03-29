export const APP_COLORS = ['primary', 'secondary'] as const;
export const TEXT_VARIANTS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'body1',
  'body2',
  'button',
  'bottom-tab',
  'chip',
] as const;
export const TEXT_ALIGNMENTS = ['left', 'center', 'right'] as const;
export const BUTTON_VARIANTS = ['contained', 'outlined', 'text'] as const;
export const BUTTON_COLORS = [...APP_COLORS] as const;
export const TEXT_COLORS = [
  ...BUTTON_COLORS,
  'textPrimary',
  'textSecondary',
  'disabled',
  'error',
  'warning',
  'success',
] as const;
export const TEXT_COLOR_TYPES = ['main', 'light', 'dark'] as const;
export const CHIP_COLORS = [
  ...BUTTON_COLORS,
  'error',
  'warning',
  'success',
] as const;
export const CHIP_VARIANTS = ['filled', 'outlined'] as const;
export const ICON_BUTTON_COLORS = [...APP_COLORS, 'default'] as const;
export const ICON_SIZES = ['small', 'medium', 'large'] as const;

export type AppColor = (typeof APP_COLORS)[number];
export type ButtonVariants = (typeof BUTTON_VARIANTS)[number];
export type ButtonColors = (typeof BUTTON_COLORS)[number];
export type TextColors = (typeof TEXT_COLORS)[number];
export type TextVariants = (typeof TEXT_VARIANTS)[number];
export type TextAlignments = (typeof TEXT_ALIGNMENTS)[number];
export type TextColorTypes = (typeof TEXT_COLOR_TYPES)[number];
export type IconSizes = (typeof ICON_SIZES)[number];
export type IconButtonColors = (typeof ICON_BUTTON_COLORS)[number];
export type ChipColors = (typeof CHIP_COLORS)[number];
export type ChipVariants = (typeof CHIP_VARIANTS)[number];
