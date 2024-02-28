import Box from '@components/Box';
import useAppSelector from '@hooks/useAppSelector';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { useAppDispatch } from '@redux/main';
import { setPageError } from '@redux/slices/reader';
import PageManager from '@redux/slices/reader/PageManager';
import { ReadingDirection } from '@redux/slices/settings';
import { ChapterPageProps } from '@screens/Reader/components/ChapterPage';
import ImageBaseRenderer from '@screens/Reader/components/ChapterPage/components/ImageBaseRenderer/ImageBaseRenderer';
import ImageErrorRenderer from '@screens/Reader/components/ChapterPage/components/ImageErrorRenderer/ImageErrorRenderer';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import { useImmutableManga } from '@screens/Reader/components/ChapterPage/context/ImmutableMangaContext';
import React from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

type ParsedWebViewData =
  | { type: 'load'; width: number; height: number }
  | { type: 'error' };

export default function usePageRenderer(
  props: ChapterPageProps,
  style: readonly [
    {
      transform: (
        | {
            scale: number;
            translateX?: undefined;
            translateY?: undefined;
          }
        | {
            translateX: number;
            scale?: undefined;
            translateY?: undefined;
          }
        | {
            translateY: number;
            scale?: undefined;
            translateX?: undefined;
          }
      )[];
    },
    {
      readonly width: number;
      readonly height: number;
    },
  ],
  stylizedHeight: number,
) {
  const {
    page: { page: pageKey },
    extendedPageState,
  } = props;

  const backgroundColor = useAppSelector((state) =>
    state.settings.reader.backgroundColor.toLowerCase(),
  );
  const { readingDirection } = useChapterPageContext();
  const { width, height } = useScreenDimensions();
  const manga = useImmutableManga();
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
  const fileUri = PageManager.getCachedFileURI(manga, pageKey);
  const uri =
    extendedPageState?.localPageUri ?? (fileUri ? `file://${fileUri}` : null);
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

  const Renderer: React.FC = React.useMemo(
    () =>
      React.memo(() => (
        <Box
          overflow="hidden"
          background-color={backgroundColor}
          justify-content="center"
          {...(readingDirection !== ReadingDirection.WEBTOON
            ? { width, height }
            : undefined)}
        >
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
      )),
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
      backgroundColor,
      readingDirection !== ReadingDirection.WEBTOON,
    ],
  );

  return Renderer;
}
