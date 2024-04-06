import React from 'react';
import { SynopsisExpandedContext } from '@/screens/MangaView/context';

export default function useSynopsisExpandedContext() {
  return React.useContext(SynopsisExpandedContext);
}
