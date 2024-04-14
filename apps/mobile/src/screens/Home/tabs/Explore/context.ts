import { FetchStatus } from '@tanstack/react-query';
import React from 'react';
import { SourceError } from '@/stores/explore';

export const ExploreFetchStatusContext =
  React.createContext<FetchStatus | null>(null);

export const ExploreErrorsContext = React.createContext<SourceError[]>([]);
