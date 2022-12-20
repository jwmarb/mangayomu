import { AppState } from '@redux/store';
import { TransitioningPageProps } from '@screens/Reader/components/TransitioningPage/TransitioningPage.interfaces';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { setReaderLoading, toggleOverlay } from '@redux/reducers/readerReducer';
import { getOrUseGlobalSetting } from '@screens/Reader/components/Overlay/components/OverlayFooter/components/Selector.helpers';

const mapStateToProps = (state: AppState, props: TransitioningPageProps) => ({
  nextChapter: state.mangas[props.manga.link].chapters[props.next],
  currentChapterInView: state.reader.chapterInView,
  previousChapter: state.mangas[props.manga.link].chapters[props.previous],
  readingDirection: getOrUseGlobalSetting(state, props.manga.link, 'readingDirection'),
  loading: state.reader.extendedState[props.extendedStateKey].loading,
  hasAlreadyFetched: state.reader.extendedState[props.extendedStateKey].hasAlreadyFetched,
  extendedStateKey: props.extendedStateKey,
  fetchChapter: props.fetchChapter,
  shouldFetch: state.reader.extendedState[props.extendedStateKey].shouldFetch,
});

const connector = connect(mapStateToProps, { setReaderLoading, toggleOverlay });

export type ConnectedTransitioningPageProps = ConnectedProps<typeof connector>;

export default connector;
