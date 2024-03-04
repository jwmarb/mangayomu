export const APP_COLORS = ['primary', 'secondary'] as const;
export type AppColor = (typeof APP_COLORS)[number];
