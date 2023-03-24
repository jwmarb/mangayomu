import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { TransitionPageProps } from '@screens/Reader/components/TransitionPage/TransitionPage.interfaces';
import { fetchPagesByChapter, ReaderChapterInfo } from '@redux/slices/reader';

const mapStateToProps = (state: AppState, props: TransitionPageProps) => {
  return {
    page: props.page,
    loading: state.reader.loading,
    transitioningPageState: state.reader.chapterInfo[props.page.next._id] as
      | ReaderChapterInfo
      | undefined,
  };
};

const connector = connect(mapStateToProps, { fetchPagesByChapter });

export type ConnectedTransitionPageProps = ConnectedProps<typeof connector>;

export default connector;
