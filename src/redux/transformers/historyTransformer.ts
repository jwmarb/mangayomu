// @ts-nocheck

import { mangaHistoryComparator } from '@redux/reducers/mangaHistoryReducer/mangaHistoryReducer.helpers';
import { MangaHistoryReducerState } from '@redux/reducers/mangaHistoryReducer/mangaHistoryReducer.interfaces';
import { orderedChaptersComparator } from '@redux/reducers/mangaReducer/mangaReducer.helpers';
import SortedList from '@utils/SortedList';
import { createTransform } from 'redux-persist';

const historyTransformer = createTransform<MangaHistoryReducerState, MangaHistoryReducerState>(
  undefined,
  (outboundState) => {
    for (let i = 0; i < outboundState.sectionListData.length; i++) {
      outboundState.sectionListData[i].data = SortedList.rehydrate(
        outboundState.sectionListData[i].data.arr,
        mangaHistoryComparator
      );
    }

    return outboundState;
  },
  {
    whitelist: ['history'],
  }
);

export default historyTransformer;
