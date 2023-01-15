import React from 'react';

export const TabsContext = React.createContext<React.Dispatch<React.SetStateAction<Set<string>>>>({} as any);

export const IndicatorWidthContext = React.createContext<React.Dispatch<React.SetStateAction<Record<number, number>>>>(
  {} as any
);
