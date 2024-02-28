import { AppState } from '@redux/main';
import { connect, ConnectedProps } from 'react-redux';
import { WebViewImageElementProps } from '@screens/Reader/components/ChapterPage/components/WebViewImageElement/WebViewImageElement.interfaces';

const mapStateToProps = (state: AppState, props: WebViewImageElementProps) => ({
  ...props,
  backgroundColor: state.settings.reader.backgroundColor.toLowerCase(),
});

const connector = connect(mapStateToProps, null, null, { forwardRef: true });

export type ConnectedWebViewImageElementProps = ConnectedProps<
  typeof connector
>;

export default connector;
