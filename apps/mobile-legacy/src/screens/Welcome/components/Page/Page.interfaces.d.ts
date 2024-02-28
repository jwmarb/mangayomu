import React from 'react';

export interface PageProps extends React.PropsWithChildren {
  index: number;
  scrollPosition: SharedValue<number>;
}
