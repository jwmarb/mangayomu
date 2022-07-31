// @ts-nocheck

import { orderedChaptersComparator } from '@redux/reducers/mangaReducer/mangaReducer.helpers';
import { MangaReducerState } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { AppState } from '@redux/store';
import SortedList from '@utils/SortedList';
import { createTransform } from 'redux-persist';

const sortedListTransformer = createTransform<MangaReducerState, MangaReducerState>(
  undefined,
  (outboundState) => {
    for (const mangaKey in outboundState) {
      outboundState[mangaKey].orderedChapters = SortedList.rehydrate(
        outboundState[mangaKey].orderedChapters.arr,
        orderedChaptersComparator
      );
    }

    return outboundState;
  },
  {
    whitelist: ['mangas'],
  }
);

export default sortedListTransformer;
