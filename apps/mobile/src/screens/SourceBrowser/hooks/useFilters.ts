import { MangaSource } from '@mangayomu/mangascraper';
import { GeneratedFilterSchema } from '@mangayomu/schema-creator';
import React from 'react';

export default function useFilters(source: MangaSource, initialGenre?: string) {
  const INITIAL_FILTER_STATE =
    (source?.FILTER_SCHEMA?.schema as GeneratedFilterSchema) ?? {};
  const init = React.useMemo(() => {
    if (initialGenre) {
      for (const key in INITIAL_FILTER_STATE) {
        const filter = INITIAL_FILTER_STATE[key];
        if (filter.type === 'inclusive/exclusive') {
          if (filter.fields.indexOf(initialGenre) !== -1) {
            return {
              ...INITIAL_FILTER_STATE,
              [key]: {
                ...filter,
                include: [initialGenre],
              },
            };
          }
        }
      }
    }
    return INITIAL_FILTER_STATE;
  }, []);
  const [filters, setFilters] = React.useState(init);
  const [finalizedFilters, setFinalizedFilters] = React.useState(init);

  function finalizeFilters() {
    setFinalizedFilters(filters);
  }
  return [filters, setFilters, finalizedFilters, finalizeFilters] as const;
}
