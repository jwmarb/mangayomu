import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { MangaHistoryItemProps } from '@screens/History/components/MangaHistoryItem/MangaHistoryItem.interfaces';

const mapStateToProps = (state: AppState, props: MangaHistoryItemProps) =>
  props;

const connector = connect(mapStateToProps);

export type ConnectedMangaHistoryItemProps = ConnectedProps<typeof connector>;

export default connector;
