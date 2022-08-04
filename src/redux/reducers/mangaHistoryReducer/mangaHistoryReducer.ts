import { mangaHistoryComparator } from '@redux/reducers/mangaHistoryReducer/mangaHistoryReducer.helpers';
import {
  MangaHistoryReducerState,
  MangaHistoryReducerAction,
  MangaHistoryObject,
} from '@redux/reducers/mangaHistoryReducer/mangaHistoryReducer.interfaces';
import SortedList from '@utils/SortedList';
import { format, isToday } from 'date-fns';

const INITIAL_STATE: MangaHistoryReducerState = {
  search: '',
  sectionListData: [],
};

export default function (
  state: MangaHistoryReducerState = INITIAL_STATE,
  action: MangaHistoryReducerAction
): MangaHistoryReducerState {
  switch (action.type) {
    case 'REMOVE_FROM_HISTORY': {
      const newState: MangaHistoryReducerState = { ...state, sectionListData: [...state.sectionListData] };
      newState.sectionListData[action.sectionListDataIndex].data.remove(action.itemToRemove);
      if (newState.sectionListData[action.sectionListDataIndex].data.size() === 0)
        newState.sectionListData.splice(action.sectionListDataIndex, 1);
      return newState;
    }
    case 'OPEN_READER': {
      const newState = { ...state };
      if (newState.sectionListData.length === 0) {
        newState.sectionListData[0] = {
          date: Date.now(),
          data: new SortedList<MangaHistoryObject>(mangaHistoryComparator, [
            {
              currentlyReadingChapter: action.chapter.link,
              mangaKey: action.manga.link,
              dateRead: Date.now(),
              sectionIndex: 0,
            },
          ]),
        };
        return newState;
      }
      const recentDate = newState.sectionListData[newState.sectionListData.length - 1].date;
      const newObj = {
        mangaKey: action.manga.link,
        currentlyReadingChapter: action.chapter.link,
        dateRead: Date.now(),
        sectionIndex: newState.sectionListData.length - 1,
      };
      if (isToday(recentDate)) {
        const existingIndex = newState.sectionListData[newState.sectionListData.length - 1].data.indexOf(newObj);
        if (existingIndex === -1) newState.sectionListData[newState.sectionListData.length - 1].data.add(newObj);
        else {
          newState.sectionListData[newState.sectionListData.length - 1].data.remove(newObj);
          newState.sectionListData[newState.sectionListData.length - 1].data.add(newObj);
        }
        return newState;
      } else {
        newState.sectionListData.push({
          date: Date.now(),
          data: new SortedList(mangaHistoryComparator, [
            {
              currentlyReadingChapter: action.chapter.link,
              mangaKey: action.manga.link,
              dateRead: Date.now(),
              sectionIndex: newState.sectionListData.length - 1,
            },
          ]),
        });
        return newState;
      }
    }
    default:
      return state;
  }
}
