import React from 'react';

export interface MainSourceSelectorProps extends React.PropsWithChildren {
  onSelectSource?: () => void;
}
