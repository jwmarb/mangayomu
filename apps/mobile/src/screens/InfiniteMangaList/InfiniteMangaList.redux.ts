import { MangaHost } from '@mangayomu/mangascraper';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (
  state: AppState,
  props: RootStackProps<'InfiniteMangaList'>,
) => ({
  state: state.browse.states[props.route.params.source] as
    | undefined
    | (typeof state.browse.states)[''],
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  source: MangaHost.getAvailableSources().get(props.route.params.source)!,
  initialQuery: state.browse.query,
  isOffline: state.explore.internetStatus === 'offline',
});

const connector = connect(mapStateToProps);

export type ConnectedInfinteMangaListProps = ConnectedProps<typeof connector>;

export default connector;
