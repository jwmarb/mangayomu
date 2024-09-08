import BackgroundColor from '@/screens/ReaderSettings/components/composites/BackgroundColor';
import FetchAhead from '@/screens/ReaderSettings/components/composites/FetchAhead';
import ToggleStatusBar from '@/screens/ReaderSettings/components/composites/ToggleStatusBar';
import React from 'react';

export default function Miscellaneous() {
  return (
    <>
      <BackgroundColor />
      <ToggleStatusBar />
      <FetchAhead />
    </>
  );
}
