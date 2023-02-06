import { AppState } from '@redux/main';
import { enableRerendering, suspendRendering } from '@redux/slices/host';
import { connect, ConnectedProps } from 'react-redux';

const mapStateToProps = (state: AppState) => state.mainSourceSelector;

const connector = connect(
  mapStateToProps,
  { enableRerendering, suspendRendering },
  null,
  {
    forwardRef: true,
  },
);

export type ConnectedMainSourceSelectorProps = ConnectedProps<typeof connector>;

export default connector;
