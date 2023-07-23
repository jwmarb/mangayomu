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
  const {
    error,
    imageComponentType,
    fallbackToWebView,
    onMessage,
    style,
    ...rest
  } = props;
  const baseStyle = React.useMemo(
    () => ({ width: style[1].width, height: style[1].height }),
    [style[1].width, style[1].height],
  );
  if (error) return null;
  switch (imageComponentType) {
    case ReaderImageComponent.AUTO:
      return fallbackToWebView ? (
        <WebViewImageElement
          ref={ref}
          onMessage={onMessage}
          style={baseStyle}
          {...rest}
          animatedStyle={style}
        />
      ) : (
        <ImageElement style={style as any} {...rest} />
      );
    case ReaderImageComponent.FAST_IMAGE:
      return (
        <FastImageElement
          style={style as any}
          {...(rest as FastImageElementProps)}
        />
      );
    case ReaderImageComponent.IMAGE:
      return <ImageElement style={style as any} {...rest} />;
    case ReaderImageComponent.WEBVIEW:
      return (
        <WebViewImageElement
          ref={ref}
          style={baseStyle}
          onMessage={onMessage}
          {...rest}
          animatedStyle={style}
        />
      );
  }
};

export default connector(React.forwardRef(ImageBaseRenderer));
