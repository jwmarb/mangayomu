'use client';

import { animated, easings, useSpring } from '@react-spring/web';
import { useIndex } from '../context/IndexContext';
import React from 'react';
import { createPortal } from 'react-dom';
import { useReader } from '@app/(root)/[source]/[title]/[chapter]/context/reader';
import TopOverlay from '@app/(root)/[source]/[title]/[chapter]/components/topoverlay';
import BottomOverlay from '@app/(root)/[source]/[title]/[chapter]/components/bottomoverlay';

export default function Overlay() {
  const [overlayEl, setOverlayEl] = React.useState<HTMLElement | null>(null);
  const topOverlayRef = React.useRef<HTMLDivElement>(null);
  const bottomOverlayRef = React.useRef<HTMLDivElement>(null);
  const isActive = useReader((store) => store.overlayActive);
  const [{ opacity }, api] = useSpring(() => ({
    opacity: 0,
    config: { duration: 150, easing: easings.linear },
  }));
  const index = useIndex();

  React.useLayoutEffect(() => {
    setOverlayEl(document.getElementById('overlay'));
  }, []);

  React.useEffect(() => {
    if (isActive) {
      api.start({ opacity: 1 });
    } else {
      api.start({ opacity: 0 });
    }
  }, [api, isActive]);

  if (overlayEl == null) return null;
  return createPortal(
    <>
      <TopOverlay
        ref={topOverlayRef}
        style={{
          opacity,
          top: opacity.to(
            [0, 1],
            [-(topOverlayRef.current?.offsetHeight ?? 0), 0],
          ),
        }}
      />
      <BottomOverlay
        ref={bottomOverlayRef}
        style={{
          opacity,
          bottom: opacity.to(
            [0, 1],
            [-(bottomOverlayRef.current?.offsetHeight ?? 0), 0],
          ),
        }}
      />
    </>,
    overlayEl,
  );
}
