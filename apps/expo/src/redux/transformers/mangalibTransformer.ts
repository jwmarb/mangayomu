// @ts-nocheck

import { StringComparator } from '@utils/Algorithms';
import SortedList from '@utils/SortedList';
import { createTransform } from 'redux-persist';
import { MangaLibReducerState } from '@redux/reducers/mangalibReducer/mangalibReducer.interfaces';
const mangalibTransformer = createTransform<MangaLibReducerState, MangaLibReducerState>(
  (inboundState, key) => {
    if (key === 'mangasList') inboundState = inboundState.arr;
    return inboundState;
  },
  (outboundState, key) => {
    if (key === 'mangasList') outboundState = SortedList.rehydrate(outboundState, StringComparator);
    return outboundState;
  }
);

export default mangalibTransformer;
