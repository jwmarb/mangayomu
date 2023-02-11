import { RGBA, hexToRgb, parseRGBA, rgbaToString } from '@mangayomu/theme';

export function generateRippleColor(color: string) {
  let parsed: RGBA;
  try {
    parsed = hexToRgb(color);
  } catch (e) {
    parsed = parseRGBA(color);
  }
  return rgbaToString({
    red: parsed.red,
    green: parsed.green,
    blue: parsed.blue,
    alpha: 0.2,
  });
}
