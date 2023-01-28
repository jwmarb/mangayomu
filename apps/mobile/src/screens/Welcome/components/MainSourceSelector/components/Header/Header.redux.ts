import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (
  state: AppState,
  props: {
    setQuery: React.Dispatch<React.SetStateAction<string>>;
  },
) => ({
  setQuery: props.setQuery,
  numSelected: state.host.name.length,
});

const connector = connect(mapStateToProps);

export type ConnectedHeaderProps = ConnectedProps<typeof connector>;

export default connector;
