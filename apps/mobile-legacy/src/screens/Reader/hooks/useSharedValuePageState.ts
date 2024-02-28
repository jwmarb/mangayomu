import { ImageScaling, ZoomStartPosition } from '@mangayomu/schemas';
import { PageAnimatedState } from '@screens/Reader/components/ChapterPage';
import React from 'react';
import { Dimensions } from 'react-native';

export default function useSharedValuePageState(
  imageScaling: ImageScaling,
  zoomStartPosition: ZoomStartPosition,
) {
  const animatedPreviousState = React.useRef<Record<string, PageAnimatedState>>(
    {},
  );
  const mounted = React.useRef<boolean>();
  React.useEffect(() => {
    if (mounted.current)
      for (const _key in animatedPreviousState.current) {
        // console.log(`Invoked reset for ${_key}`);
        const key = _key as keyof typeof animatedPreviousState.current;
        const defaultState =
          animatedPreviousState.current[key].onImageTypeChange();
        animatedPreviousState.current[key].minScale = defaultState.minScale;
        animatedPreviousState.current[key].scale = defaultState.scale;
        animatedPreviousState.current[key].translateX = defaultState.translateX;
        animatedPreviousState.current[key].translateY = defaultState.translateY;
      }
    else mounted.current = true;
  }, [imageScaling, zoomStartPosition]);

  React.useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({ screen }) => {
      for (const _key in animatedPreviousState.current) {
        // console.log(`Invoked onDimensionsChange for ${_key}`);
        const key = _key as keyof typeof animatedPreviousState.current;
        const newAnimatedState = animatedPreviousState.current[
          key as keyof typeof animatedPreviousState.current
        ].onDimensionsChange(screen.width, screen.height);
        animatedPreviousState.current[key].minScale = newAnimatedState.minScale;
        animatedPreviousState.current[key].scale = newAnimatedState.scale;
        animatedPreviousState.current[key].translateX =
          newAnimatedState.translateX;
        animatedPreviousState.current[key].translateY =
          newAnimatedState.translateY;
      }
    });
    return () => {
      listener.remove();
    };
  }, []);

  return animatedPreviousState;
}
