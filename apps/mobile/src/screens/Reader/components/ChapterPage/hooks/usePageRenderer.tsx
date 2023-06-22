import Box from '@components/Box';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { useAppDispatch } from '@redux/main';
import { ExtendedReaderPageState, setPageError } from '@redux/slices/reader';
import ImageBaseRenderer from '@screens/Reader/components/ChapterPage/components/ImageBaseRenderer/ImageBaseRenderer';
import ImageErrorRenderer from '@screens/Reader/components/ChapterPage/components/ImageErrorRenderer/ImageErrorRenderer';
import React from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

type ParsedWebViewData =
  | { type: 'load'; width: number; height: number }
  | { type: 'error' };

interface UsePageRendererArgs {
  pageKey: string;
  style: {
    width: number;
    height: number;
  };
  extendedPageState?: ExtendedReaderPageState;
  stylizedHeight: number;
}
export default function usePageRenderer(args: UsePageRendererArgs) {
  const { pageKey, style, extendedPageState, stylizedHeight } = args;
  const { height } = useScreenDimensions();
  /**
   * In the case of very large images which can be observed in some webtoons (e.g. images that exceed the device's height by 5-8 times),
   * Image performs downsampling on the image, reducing its quality that could make its text unreadable or its content uncomprehensible. As a workaround, the page will fallback to using WebView, which is
   * much slower, however, maintains the best image quality.
   *
   * EDIT: Webview should no longer be used due to its instability. Extremely long panels crashes the app.
   */
  const fallbackToWebView = stylizedHeight / height > 1;

  /**
   * When an image's dimensions are larger than normal, React Native's built-in Image component downsamples the image to the point it becomes unreadable (because of Fresco). A workaround for this is to use FastImage.
   *
   * NOTE: FastImage's image quality is noticeably worst than WebView
   */
  // const fallBackToFastImage = stylizedHeight / height > 1;
  const dispatch = useAppDispatch();
  const webViewRef = React.useRef<WebView>(null);
  const uri = extendedPageState?.localPageUri ?? pageKey;
  const handleOnReload = React.useCallback(() => {
    dispatch(setPageError({ pageKey, value: false }));
    webViewRef.current?.reload();
  }, [dispatch, setPageError, pageKey]);

  const handleOnError = React.useCallback(() => {
    dispatch(setPageError({ pageKey, value: true }));
  }, [dispatch, setPageError, pageKey]);

  const handleOnMessage = React.useCallback(
    (e: WebViewMessageEvent) => {
      const msg = JSON.parse(e.nativeEvent.data) as ParsedWebViewData;
      switch (msg.type) {
        case 'error':
          handleOnError();
          break;
      }
    },
    [handleOnError],
  );

  const Renderer: React.FC = React.useCallback(
    () => (
      <Box style={style} align-self="center">
        <ImageBaseRenderer
          onError={handleOnError}
          onMessage={handleOnMessage}
          ref={webViewRef}
          uri={uri}
          style={style}
          fallbackToWebView={fallbackToWebView}
        />
        {extendedPageState?.error && (
          <ImageErrorRenderer
            pageKey={pageKey}
            onReload={handleOnReload}
            style={style}
          />
        )}
      </Box>
    ),
    [
      style,
      handleOnError,
      handleOnMessage,
      handleOnReload,
      uri,
      style,
      fallbackToWebView,
      extendedPageState?.error,
      pageKey,
    ],
  );

  return Renderer;
}
