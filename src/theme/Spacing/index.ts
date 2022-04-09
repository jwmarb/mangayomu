/**
 * A space multiplier. Default is 8
 */
const SPACE_MULTIPLIER = 8;

/**
 * Automatically apply theme spacing to keep spacing consistency throughout the designing the application.
 * @param n Units to apply spacing. There can only be a maximum of 4 arguments
 * @example
 * ```js
 * spacing(1); // 8px
 * spacing(1, 1); // 8px 8px
 * spacing(1, 1, 1); // 8px 8px 8px 0px
 * spacing(1, 1, 1, 1); // 8px 8px 8px 8px
 * ```
 */
export default function spacing(...n: number[]) {
  if (n.length === 3) n.push(0);
  return n.map((unit) => `${unit * SPACE_MULTIPLIER}px`).join(' ');
}
