import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { ImageBaseRendererProps } from '@screens/Reader/components/ChapterPage/components/ImageBaseRenderer/ImageBaseRenderer.interfaces';

const mapStateToProps = (state: AppState, props: ImageBaseRendererProps) => ({
  ...props,
  imageComponentType: state.settings.reader.advanced.imageComponent,
});

const connector = connect(mapStateToProps, null, null, { forwardRef: true });

export type ConnectedImageBaseRendererProps = ConnectedProps<typeof connector>;

export default connector;
