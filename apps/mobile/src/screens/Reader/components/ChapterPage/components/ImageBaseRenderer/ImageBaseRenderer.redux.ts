import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { ImageBaseRendererProps } from './';

const mapStateToProps = (state: AppState, props: ImageBaseRendererProps) => ({
  ...props,
  imageComponentType: state.settings.reader.advanced.imageComponent,
});

const connector = connect(mapStateToProps, null, null, { forwardRef: true });

export type ConnectedImageBaseRendererProps = ConnectedProps<typeof connector>;

export default connector;
