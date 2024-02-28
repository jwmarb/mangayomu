import { Dimensions } from 'react-native';
import React from 'react';

/**
 * A hook that returns the screen's dimensions rather than window's dimensions called by `useWindowDimensions()`
 * @returns Returns the screen's width and height
 */
export default function useScreenDimensions() {
  const [width, setWidth] = React.useState<number>(
    Dimensions.get('screen').width,
  );
  const [height, setHeight] = React.useState<number>(
    Dimensions.get('screen').height,
  );
  React.useEffect(() => {
    const p = Dimensions.addEventListener('change', ({ screen }) => {
      setHeight(screen.height);
      setWidth(screen.width);
    });
    return () => {
      p.remove();
    };
  });

  return { width, height };
}
