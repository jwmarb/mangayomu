import { AppState } from '@redux/main';
import {
  setAutoFetch,
  setAutoFetchThresholdPosition,
  setAutoFetchPageThreshold,
} from '@redux/slices/settings';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => ({
  autoFetchType: state.settings.reader.automaticallyFetchNextChapter.type,
  thresholdPosition:
    state.settings.reader.automaticallyFetchNextChapter.thresholdPosition,
  pageThreshold:
    state.settings.reader.automaticallyFetchNextChapter.pageThreshold,
});

const connector = connect(mapStateToProps, {
  setAutoFetch,
  setAutoFetchThresholdPosition,
  setAutoFetchPageThreshold,
});

export type ConnectedAutoFetchProps = ConnectedProps<typeof connector>;

export default connector;
