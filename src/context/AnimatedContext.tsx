import React from 'react';

export const AnimatedContext = React.createContext<Record<string, unknown>>(null as any);

export const AnimatedProvider: React.FC<React.PropsWithChildren<{ style: Record<string, unknown> }>> = ({
  children,
  style,
}) => {
  return <AnimatedContext.Provider value={style}>{children}</AnimatedContext.Provider>;
};
