import { MangaSource } from '@mangayomu/mangascraper';
import { GeneratedFilterSchema } from '@mangayomu/schema-creator';
import React from 'react';

export default function useFilters(source: MangaSource) {
  const INITIAL_FILTER_STATE =
    (source?.FILTER_SCHEMA?.schema as GeneratedFilterSchema) ?? {};
  const [filters, setFilters] = React.useState(INITIAL_FILTER_STATE);
  const [finalizedFilters, setFinalizedFilters] =
    React.useState(INITIAL_FILTER_STATE);

  function finalizeFilters() {
    setFinalizedFilters(filters);
  }
  return [filters, setFilters, finalizedFilters, finalizeFilters] as const;
}
