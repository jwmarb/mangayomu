import React from 'react';

export const PageSliderNavigatorSnapPointsContext = React.createContext<
  number[]
>([]);
export const useSnapPoints = () =>
  React.useContext(PageSliderNavigatorSnapPointsContext);
