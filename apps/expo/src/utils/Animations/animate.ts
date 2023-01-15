import React from 'react';

/**
 * Animate an element without creating a new file or calling useAnimated hook
 * @param element The element that needs an animation
 * @param preset The animation preset
 * @returns Returns the element but animated
 */
export default function animate(
  element: React.ReactElement,
  ...preset: ((component: React.FC) => React.FC)[]
): React.ReactElement {
  return React.createElement(
    preset.reduce(
      (prev, curr) => () => React.createElement(curr(prev)),
      () => element
    )
  );
}
