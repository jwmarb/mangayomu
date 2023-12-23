import React from 'react';

import { ReaderImageComponent } from '@redux/slices/settings';
import WebViewImageElement from '@screens/Reader/components/ChapterPage/components/WebViewImageElement';
import ImageElement from '@screens/Reader/components/ChapterPage/components/ImageElement';
import WebView from 'react-native-webview';
import useAppSelector from '@hooks/useAppSelector';
import { ImageBaseRendererProps } from '@screens/Reader/components/ChapterPage/components/ImageBaseRenderer';

const ImageBaseRenderer: React.ForwardRefRenderFunction<
  WebView,
  ImageBaseRendererProps
> = (props, ref) => {
  const { error, fallbackToWebView, onMessage, style, ...rest } = props;
  const imageComponentType = useAppSelector(
    (state) => state.settings.reader.advanced.imageComponent,
  );
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
      return null;
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

export default React.forwardRef(ImageBaseRenderer);
