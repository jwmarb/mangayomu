import { MangaHost } from '@mangayomu/mangascraper';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { toggleConfig } from '@redux/slices/host';

const mapStateToProps = (
  state: AppState,
  props: RootStackProps<'SourceView'>,
) => ({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  source: MangaHost.sourcesMap.get(props.route.params.source)!,
  config: state.host.hostsConfig[props.route.params.source],
});

const connector = connect(mapStateToProps, { toggleConfig });

export type ConnectedSourceViewProps = ConnectedProps<typeof connector>;

export default connector;
