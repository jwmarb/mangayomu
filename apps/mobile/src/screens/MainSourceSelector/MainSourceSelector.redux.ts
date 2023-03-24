import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { setQuery } from '@redux/slices/mainSourceSelector';
import { RootStackProps } from '@navigators/Root/Root.interfaces';

const mapStateToProps = (
  state: AppState,
  props: RootStackProps<'MainSourceSelector'>,
) => ({ ...props, ...state.mainSourceSelector });

const connector = connect(mapStateToProps, { setQuery });

export type ConnectedMainSourceSelectorProps = ConnectedProps<typeof connector>;

export default connector;
