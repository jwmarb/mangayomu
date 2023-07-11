import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import {
  toggleReverse,
  setSort,
  setQuery,
} from '@redux/slices/mainSourceSelector';
import { MangaHost } from '@mangayomu/mangascraper/src';
import { addAllSources, removeAllSources } from '@redux/slices/host';

const mapStateToProps = (state: AppState) => ({
  numSelected: state.host.name.length,
  totalSources: MangaHost.sources.length,
  query: state.mainSourceSelector.query,
});

const connector = connect(mapStateToProps, {
  toggleReverse,
  setSort,
  setQuery,
  addAllSources,
  removeAllSources,
});

export type ConnectedHeaderProps = ConnectedProps<typeof connector>;

export default connector;
