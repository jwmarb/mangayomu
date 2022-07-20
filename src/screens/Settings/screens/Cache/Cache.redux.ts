import { AppState } from '@redux/store';
import { connect, ConnectedProps } from 'react-redux';
import { toggleCache, setMaxCacheSize } from '@redux/reducers/settingsReducer';

const mapStateToProps = (state: AppState, props: React.PropsWithChildren<{}>) => ({
  ...props,
  cacheEnabled: state.settings.cache.enabled,
  maxCacheSize: state.settings.cache.maxSize,
});

const connector = connect(mapStateToProps, { toggleCache, setMaxCacheSize });

export type ConnectedCacheProps = ConnectedProps<typeof connector>;

export default connector;
