import React from 'react';

export type SkipButtonProps = {
  onSkip: () => void;
} & (
  | {
      previous: boolean;
    }
  | { next: boolean }
);
