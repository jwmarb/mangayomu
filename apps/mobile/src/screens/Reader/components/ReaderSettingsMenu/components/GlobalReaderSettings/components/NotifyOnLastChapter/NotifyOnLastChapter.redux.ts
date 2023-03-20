import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleNotifyOnLastChapter } from '@redux/slices/settings';

const mapStateToProps = (state: AppState) => ({
  notifyOnLastChapter: state.settings.reader.notifyOnLastChapter,
});

const connector = connect(mapStateToProps, { toggleNotifyOnLastChapter });

export type ConnectedNotifyOnLastChapterProps = ConnectedProps<
  typeof connector
>;

export default connector;
