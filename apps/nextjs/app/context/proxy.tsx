'use client';
import React from 'react';

const ProxyContext = React.createContext<string | undefined>(undefined);
export const useMangaProxy = () => React.useContext(ProxyContext);
export default function MangaProxyProvider({
  children,
  proxy,
}: React.PropsWithChildren<{ proxy?: string }>) {
  return (
    <ProxyContext.Provider value={proxy}>{children}</ProxyContext.Provider>
  );
}
