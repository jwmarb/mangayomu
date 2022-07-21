// @ts-nocheck

import { orderedChaptersComparator } from '@redux/reducers/mangaReducer/mangaReducer.helpers';
import { MangaReducerState } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { AppState } from '@redux/store';
import SortedList from '@utils/SortedList';
import { createTransform } from 'redux-persist';

const sortedListTransformer = createTransform<MangaReducerState, MangaReducerState>(
  (_inboundState) => {
    const inboundState = { ...inboundState };
    for (const mangaKey in inboundState) {
      if (
        !Array.isArray(inboundState[mangaKey].orderedChapters) &&
        inboundState[mangaKey].orderedChapters instanceof SortedList
      )
        inboundState[mangaKey].orderedChapters = inboundState[mangaKey].orderedChapters.toArray();
    }
    return inboundState;
  },
  (outboundState) => {
    for (const mangaKey in outboundState) {
      // console.log(`${mangaKey} -> BEFORE TRANSFORM: ${outboundState[mangaKey].orderedChapters instanceof SortedList}`);
      outboundState[mangaKey].orderedChapters = SortedList.rehydrate(
        outboundState[mangaKey].orderedChapters,
        orderedChaptersComparator
      );
      // console.log(`${mangaKey} -> AFTER TRANSFORM: ${outboundState[mangaKey].orderedChapters instanceof SortedList}`);
    }
    return outboundState;
  },
  { whitelist: ['mangas'] }
);

export default sortedListTransformer;
