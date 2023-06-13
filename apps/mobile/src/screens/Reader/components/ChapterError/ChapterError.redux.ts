import { AppState } from '@redux/main';
import { ChapterErrorProps } from '@screens/Reader/components/ChapterError/ChapterError.interfaces';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState, props: ChapterErrorProps) => ({
  ...props,
  backgroundColor: state.settings.reader.backgroundColor,
});

const connector = connect(mapStateToProps);

export type ConnectedChapterErrorProps = ConnectedProps<typeof connector>;

export default connector;
