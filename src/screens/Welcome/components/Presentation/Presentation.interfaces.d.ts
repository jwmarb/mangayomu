import React from 'react';

export interface PresentationProps {
  screens: React.ReactElement<any>[];
  onNextScreen: (index: number) => void;
  index: number;
  onPreviousScreen: (index: number) => void;
}
