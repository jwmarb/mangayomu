import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { setReaderImageComponent } from '@redux/slices/settings';

const mapStateToProps = (state: AppState) => ({
  imageComponent: state.settings.reader.advanced.imageComponent,
});

const connector = connect(mapStateToProps, { setReaderImageComponent });

export type ConnectedAdvancedProps = ConnectedProps<typeof connector>;

export default connector;
