import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { TransitionPageProps } from '@screens/Reader/components/TransitionPage/TransitionPage.interfaces';

const mapStateToProps = (state: AppState, props: TransitionPageProps) => {
  return {
    page: props.page,
    loading: state.reader.loading,
  };
};

const connector = connect(mapStateToProps);

export type ConnectedTransitionPageProps = ConnectedProps<typeof connector>;

export default connector;
