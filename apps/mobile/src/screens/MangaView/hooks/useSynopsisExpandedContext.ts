import React from 'react';
import { SynopsisExpandedContext } from '@/screens/MangaView/components/Synopsis';

export default function useSynopsisExpandedContext() {
  return React.useContext(SynopsisExpandedContext);
}
