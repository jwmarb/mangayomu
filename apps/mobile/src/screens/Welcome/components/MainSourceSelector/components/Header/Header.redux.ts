import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import {
  toggleReverse,
  setSort,
  setIndex,
  setQuery,
} from '@redux/slices/mainSourceSelector';
import { MangaHost } from '@mangayomu/mangascraper';

const mapStateToProps = (state: AppState) => ({
  numSelected: state.host.name.length,
  index: state.mainSourceSelector.index,
  totalSources: MangaHost.getListSources().length,
  query: state.mainSourceSelector.query,
});

const connector = connect(mapStateToProps, {
  toggleReverse,
  setSort,
  setIndex,
  setQuery,
});

export type ConnectedHeaderProps = ConnectedProps<typeof connector>;

export default connector;
