import React from 'react';
import connector, {
  ConnectedImageBaseRendererProps,
} from './ImageBaseRenderer.redux';
import { ReaderImageComponent } from '@redux/slices/settings';
import WebViewImageElement from '@screens/Reader/components/ChapterPage/components/WebViewImageElement';
import FastImageElement from '@screens/Reader/components/ChapterPage/components/FastImageElement';
import ImageElement from '@screens/Reader/components/ChapterPage/components/ImageElement';
import { FastImageElementProps } from '@screens/Reader/components/ChapterPage/components/FastImageElement/FastImageElement.interfaces';
import WebView from 'react-native-webview';

const ImageBaseRenderer: React.ForwardRefRenderFunction<
  WebView,
  ConnectedImageBaseRendererProps
> = (props, ref) => {
  const { error, imageComponentType, fallbackToWebView, onMessage, ...rest } =
    props;
  if (error) return null;
  switch (imageComponentType) {
    case ReaderImageComponent.AUTO:
      return fallbackToWebView ? (
        <WebViewImageElement ref={ref} onMessage={onMessage} {...rest} />
      ) : (
        <ImageElement {...rest} />
      );
    case ReaderImageComponent.FAST_IMAGE:
      return <FastImageElement {...(rest as FastImageElementProps)} />;
    case ReaderImageComponent.IMAGE:
      return <ImageElement {...rest} />;
    case ReaderImageComponent.WEBVIEW:
      return <WebViewImageElement ref={ref} onMessage={onMessage} {...rest} />;
  }
};

export default connector(React.forwardRef(ImageBaseRenderer));
