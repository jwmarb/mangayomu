import React from 'react';

export interface PresentationProps {
  screens: React.FC[];
  onNextScreen: (index: number) => void;
  index: number;
  onPreviousScreen: (index: number) => void;
  onFinish: () => void;
}
