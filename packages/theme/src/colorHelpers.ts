import { RGBA } from '.';

/**
 * Convert a hexadecimal to RGB value
 * @param hex The hexadecimal
 * @returns Returns the RGBA version of the hex
 */
export function hexToRgb(hex: string): RGBA {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result)
    return {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16),
      alpha: 1,
    };
  else throw Error('Invalid hex value: ' + hex);
}

/**
 * Convert RGBA to hexadecimal. This does not preserve alpha
 * @param rgba The RGBA value
 * @returns Returns the hexadecimal version of RGBA
 */
export function rgbaToHex(rgba: RGBA): string {
  return (
    '#' +
    (rgba.red | (1 << 8)).toString(16).slice(1) +
    (rgba.green | (1 << 8)).toString(16).slice(1) +
    (rgba.blue | (1 << 8)).toString(16).slice(1)
  );
}

/**
 * Parse a string RGBA
 * @param rgba RGBA value
 * @returns Returns a string version of rgba
 */
export function parseRGBA(rgba: string): RGBA {
  const rgbaregex = /\d+\.?\d*/g;
  const p = rgba.match(rgbaregex);
  if (p == null) throw Error('Invalid RGBA input: ' + rgba);
  const [red, green, blue, alpha] = p;
  return {
    red: parseInt(red),
    green: parseInt(green),
    blue: parseInt(blue),
    alpha: parseFloat(alpha),
  };
}

/**
 * Convert an RGBA to a string
 * @param rgba The color's RGBA
 * @returns Returns a string version of RGBA
 */
export function rgbaToString(rgba: RGBA): string {
  return `rgba(${rgba.red}, ${rgba.green}, ${rgba.blue}, ${rgba.alpha})`;
}
