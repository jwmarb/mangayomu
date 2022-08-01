import { generateExtendedStateKey } from '@redux/reducers/readerReducer/readerReducer.helpers';
import {
  ChapterTransitionState,
  ReaderReducerAction,
  ReaderReducerState,
} from '@redux/reducers/readerReducer/readerReducer.interfaces';
import {
  OverloadedSetting,
  ReaderScreenOrientation,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import { Dimensions } from 'react-native';

const INITIAL_STATE: ReaderReducerState = {
  index: 0,
  showModal: false,
  modalPageURI: null,
  numberOfPages: {},
  maintainScrollPositionIndex: -1,
  maintainScrollPositionOffset: { 'Left to Right': 0, 'Right to Left': 0, Vertical: 0, Webtoon: 0 },
  showOverlay: false,
  data: [],
  chapterInView: null,
  shouldActivateOnStart: false,
  error: '',
  loadingContent: true,
  extendedState: {},
  chapterPositionOffset: {},
  shouldTrackIndex: true,
  isMounted: false,
  forcedShouldTrackIndex: true,
};

const INITIAL_EXTENDED_STATE: ChapterTransitionState = {
  loading: false,
  hasAlreadyFetched: false,
  shouldFetch: false,
};

export default function (state: ReaderReducerState = INITIAL_STATE, action: ReaderReducerAction): ReaderReducerState {
  switch (action.type) {
    case 'SET_DEVICE_ORIENTATION_FOR_SERIES':
      if (action.orientation !== OverloadedSetting.AUTO)
        return {
          ...state,
          forcedShouldTrackIndex: false,
          shouldTrackIndex: false,
        };
      return state;
    case 'SHOULD_TRACK_INDEX':
      return {
        ...state,
        shouldTrackIndex: action.payload,
        forcedShouldTrackIndex: action.payload,
      };
    case 'SET_READER_MODAL_VISIBILITY':
      if (action.show)
        return {
          ...state,
          showModal: true,
          modalPageURI: action.page,
        };
      return {
        ...state,
        showModal: false,
        modalPageURI: null,
      };
    case 'SET_READER_INDEX':
      if (state.forcedShouldTrackIndex) {
        if (!state.shouldTrackIndex)
          return {
            ...state,
            shouldTrackIndex: true,
          };
        return {
          ...state,
          index: action.index,
        };
      }
      return state;
    case 'SHOW_OVERLAY':
      return {
        ...state,
        showOverlay: true,
      };
    case 'TOGGLE_OVERLAY':
      return {
        ...state,
        showOverlay: !state.showOverlay,
      };
    case 'RESET_SCROLL_POSITION_INDEX': {
      return {
        ...state,
        maintainScrollPositionIndex: -1,
      };
    }
    case 'TRANSITIONING_PAGE_SHOULD_FETCH_CHAPTER':
      if (state.extendedState[action.extendedStateKey].hasAlreadyFetched === true) return state;
      return {
        ...state,
        extendedState: {
          ...state.extendedState,
          [action.extendedStateKey]: {
            ...state.extendedState[action.extendedStateKey],
            shouldFetch: true,
          },
        },
      };
    case 'SET_SCROLL_POSITION_INDEX':
      return {
        ...state,
        maintainScrollPositionIndex: action.index,
      };
    case 'SET_CURRENTLY_READING_CHAPTER':
      return {
        ...state,
        chapterInView: action.chapter,
      };
    case 'READER_LOADING':
      if (action.extendedStateKey) {
        return {
          ...state,
          extendedState: {
            ...state.extendedState,
            [action.extendedStateKey]: {
              ...state.extendedState[action.extendedStateKey],
              loading: action.loading,
              hasAlreadyFetched: true,
            },
          },
        };
      }
      return {
        ...state,
        loadingContent: action.loading,
      };
    case 'READER_ERROR':
      return {
        ...state,
        error: action.error,
      };
    case 'SHOULD_ACTIVATE_ON_START':
      return {
        ...state,
        shouldActivateOnStart: action.shouldActivateOnStart,
      };
    case 'OPEN_READER':
      if (state.chapterInView == null)
        return {
          ...state,
          chapterInView: action.chapter,
          isMounted: true,
        };
      return state;
    case 'EXIT_READER':
      return INITIAL_STATE;
    case 'APPEND_PAGES':
      if (state.isMounted) {
        switch (action.appendLocation) {
          case 'start': {
            const newState = { ...state };
            const item = newState.data[0];
            const nextChapterFromPages = action.pages.pop();
            const previousChapterFromPages = action.pages[0];
            if (nextChapterFromPages == null)
              throw Error('There is no data. Add data before dispatching to the start of data.');
            if (item.type !== 'CHAPTER_TRANSITION') throw Error('Item is not type CHAPTER_TRANSITION');

            if (nextChapterFromPages.type !== 'NEXT_CHAPTER')
              throw Error('nextChapterFromPages does not match type "NEXT_CHAPTER"');
            if (item.next !== nextChapterFromPages.key)
              throw Error(
                `${item.next} does not match ${nextChapterFromPages.key}. It is appended to the wrong location.`
              );

            if (previousChapterFromPages.type === 'PREVIOUS_CHAPTER') {
              const extendedStateKey = generateExtendedStateKey(action.chapter.link, previousChapterFromPages.key);
              action.pages[0] = {
                type: 'CHAPTER_TRANSITION',
                next: action.chapter.link,
                previous: previousChapterFromPages.key,
                extendedStateKey,
              };
              if (extendedStateKey in newState.extendedState === false)
                newState.extendedState[extendedStateKey] = INITIAL_EXTENDED_STATE;
            }
            /**
             * If data is appended at the start, FlatList automatically scrolls to the first beginning index.
             * maintainScrollPositionOffset must be adjusted here accordingly
             */
            const { width, height } = Dimensions.get('window');
            const maintainScrollPositionOffset = action.pages.reduce(
              (prev, curr) => {
                switch (curr.type) {
                  case 'PAGE':
                    const maxScale = width / curr.width; // see Page.tsx
                    prev.horizontalOffset += width;
                    prev.verticalOffset += height;
                    prev.webtoonOffset += curr.height * maxScale;
                    break;
                  default:
                    prev.horizontalOffset += width;
                    prev.verticalOffset += height;
                    prev.webtoonOffset += height;
                    break;
                }
                return prev;
              },
              { horizontalOffset: 0, verticalOffset: 0, webtoonOffset: 0 } as {
                horizontalOffset: number;
                verticalOffset: number;
                webtoonOffset: number;
              }
            );
            for (const key in newState.chapterPositionOffset) {
              newState.chapterPositionOffset[key] += action.pages.length;
            }
            newState.chapterPositionOffset[action.chapter.link] = previousChapterFromPages.type === 'PAGE' ? 0 : 1;
            newState.numberOfPages[action.chapter.link] = action.numOfPages;
            return {
              ...newState,
              data: action.pages.concat(newState.data),
              maintainScrollPositionOffset: {
                'Left to Right': maintainScrollPositionOffset.horizontalOffset,
                'Right to Left': maintainScrollPositionOffset.horizontalOffset,
                Vertical: maintainScrollPositionOffset.verticalOffset,
                Webtoon: maintainScrollPositionOffset.webtoonOffset,
              },
              maintainScrollPositionIndex: action.pages.length,
              shouldTrackIndex: false,
            };
          }
          case 'end': {
            const newState = { ...state };

            const item = newState.data[newState.data.length - 1];
            const previousChapterFromPages = action.pages.shift();
            const nextChapterFromPages = action.pages[action.pages.length - 1];
            if (previousChapterFromPages == null)
              throw Error('There is no data. Add data before dispatching to the end of data.');
            if (item.type !== 'CHAPTER_TRANSITION') throw Error('Item is not type CHAPTER_TRANSITION');

            if (previousChapterFromPages.type !== 'PREVIOUS_CHAPTER')
              throw Error('Item is appended at the wrong location of data.');
            if (item.previous !== previousChapterFromPages.key)
              throw Error(
                `${item.previous} does not match ${previousChapterFromPages.key}. It is appended to the wrong location.`
              );

            if (nextChapterFromPages.type === 'NEXT_CHAPTER') {
              const extendedStateKey = generateExtendedStateKey(nextChapterFromPages.key, action.chapter.link);
              action.pages[action.pages.length - 1] = {
                type: 'CHAPTER_TRANSITION',
                next: nextChapterFromPages.key,
                previous: action.chapter.link,
                extendedStateKey,
              };
              if (extendedStateKey in newState.extendedState === false)
                newState.extendedState[extendedStateKey] = INITIAL_EXTENDED_STATE;
            }

            newState.chapterPositionOffset[action.chapter.link] = newState.data.length;
            newState.numberOfPages[action.chapter.link] = action.numOfPages;

            return {
              ...newState,
              data: newState.data.concat(action.pages),
              maintainScrollPositionOffset: undefined,
              maintainScrollPositionIndex: 0,
            };
          }
          default:
            const newState = { ...state };
            const previousChapterFromPages = action.pages[0];
            const nextChapterFromPages = action.pages[action.pages.length - 1];
            if (previousChapterFromPages.type === 'PREVIOUS_CHAPTER') {
              const extendedStateKey = generateExtendedStateKey(action.chapter.link, previousChapterFromPages.key);
              action.pages[0] = {
                type: 'CHAPTER_TRANSITION',
                next: action.chapter.link,
                previous: previousChapterFromPages.key,
                extendedStateKey,
              };
              if (extendedStateKey in newState.extendedState === false)
                newState.extendedState[extendedStateKey] = INITIAL_EXTENDED_STATE;
            }
            if (nextChapterFromPages.type === 'NEXT_CHAPTER') {
              const extendedStateKey = generateExtendedStateKey(nextChapterFromPages.key, action.chapter.link);
              action.pages[action.pages.length - 1] = {
                type: 'CHAPTER_TRANSITION',
                next: nextChapterFromPages.key,
                previous: action.chapter.link,
                extendedStateKey,
              };
              if (extendedStateKey in newState.extendedState === false)
                newState.extendedState[extendedStateKey] = INITIAL_EXTENDED_STATE;
            }
            newState.numberOfPages[action.chapter.link] = action.numOfPages;

            return {
              ...newState,
              data: action.pages,
              maintainScrollPositionOffset: undefined,
              maintainScrollPositionIndex: action.initialIndexPage,
              index: action.initialIndexPage,
              chapterPositionOffset: {
                [action.chapter.link]: previousChapterFromPages.type === 'PAGE' ? 0 : 1,
              },
            };
        }
      }
      return state;

    default:
      return state;
  }
}
