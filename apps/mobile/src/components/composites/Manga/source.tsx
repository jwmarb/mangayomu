import React from 'react';
import type { MangaSource } from '@mangayomu/mangascraper';

const SourceContext = React.createContext<MangaSource | null>(null);

export function useSourceContext() {
  return React.useContext(SourceContext);
}

type SourceProviderProps = {
  source: MangaSource;
};

export function SourceProvider(
  props: React.PropsWithChildren<SourceProviderProps>,
) {
  return (
    <SourceContext.Provider value={props.source}>
      {props.children}
    </SourceContext.Provider>
  );
}

export type SourceProviderComponent = typeof SourceProvider;
