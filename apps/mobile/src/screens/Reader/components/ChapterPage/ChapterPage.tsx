import React from 'react';
import { Image, useWindowDimensions } from 'react-native';
import FastImage, {
  FastImageProps,
  OnLoadEvent,
} from 'react-native-fast-image';
import {
  ChapterPageContextState,
  ChapterPageProps,
} from './ChapterPage.interfaces';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import Box, { AnimatedBox } from '@components/Box';
import Text from '@components/Text';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import { StatusBar } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import useMountedEffect from '@hooks/useMountedEffect';
import connector, { ConnectedChapterPageProps } from './ChapterPage.redux';
import Icon from '@components/Icon';
import { moderateScale } from 'react-native-size-matters';
import Stack, { AnimatedStack } from '@components/Stack';
import Hyperlink from '@components/Hyperlink';
import Button from '@components/Button';
import Divider from '@components/Divider';
import { useLocalObject, useLocalRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { PageSchema } from '@database/schemas/Page';
import { ReaderImageComponent, ReadingDirection } from '@redux/slices/settings';
import { useIsFocused } from '@react-navigation/native';
import useScreenDimensions from '@hooks/useScreenDimensions';

export function removeURLParams(url: string) {
  const startParam = url.indexOf('?');
  if (startParam === -1) return url;
  return url.substring(0, startParam);
}

export function getFileExtension(url: string) {
  const found = url.match(/jpe?g|png|gif|bmp|webp/g);
  if (found == null) throw Error(`Unknown file extension. Input was ${url}`);
  return found[0];
}

export const ChapterPageContext = React.createContext<
  ChapterPageContextState | undefined
>(undefined);
const useChapterPageContext = () => {
  const ctx = React.useContext(ChapterPageContext);
  if (ctx == null)
    throw Error('ChapterPage must be a child of ChapterPageContext');
  return ctx;
};

const ChapterPage: React.FC<ConnectedChapterPageProps> = (props) => {
  const { imageMenuRef, tapGesture, readingDirection } =
    useChapterPageContext();
  const { width, height } = useScreenDimensions();
  const { page: pageKey, error, localPageUri } = props.page;
  const { backgroundColor, imageComponentType } = props;
  const isFocused = useIsFocused();
  const webViewRef = React.useRef<WebView>(null);
  const imageWidth = props.page.width;
  const imageHeight = props.page.height;
  const scale = width / imageWidth;
  const stylizedHeight = ReadingDirection.WEBTOON
    ? scale * imageHeight
    : height;
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
  const visibleWithoutErrorOpacity = useSharedValue(1); // for WebView only

  const style = React.useMemo(
    () => ({
      width,
      height: stylizedHeight,
    }),
    [width, stylizedHeight],
  );

  const webViewStyle = useAnimatedStyle(
    () => ({
      width,
      height: stylizedHeight,
      opacity: visibleWithoutErrorOpacity.value,
    }),
    [width, stylizedHeight],
  );

  // const animatedLoadingStyle = useAnimatedStyle(() => ({
  //   opacity: loadingOpacity.value,
  // }));

  function handleOnReload() {
    // setError(false);
    // loadingOpacity.value = fallbackToWebView ? 0 : 1;
    visibleWithoutErrorOpacity.value = 1;
    webViewRef.current?.reload();
  }

  // function handleOnLoadEnd() {
  //   loadingOpacity.value = 0;
  // }
  // function handleOnLoadStart() {
  //   loadingOpacity.value = 1;
  // }
  function handleOnError() {
    // setError(true);
    // loadingOpacity.value = 0;
    visibleWithoutErrorOpacity.value = 0;
  }

  const holdGesture = React.useMemo(
    () =>
      Gesture.LongPress().onStart(() => {
        if (imageMenuRef.current != null) runOnJS(imageMenuRef.current.open)();
        // parsedPageKey, pageKey
      }),
    [],
  );

  const gestures = React.useMemo(
    () => Gesture.Simultaneous(holdGesture, tapGesture),
    [holdGesture, tapGesture],
  );

  const handleOnMessage = (e: WebViewMessageEvent) => {
    const msg = JSON.parse(e.nativeEvent.data) as ParsedWebViewData;
    switch (msg.type) {
      case 'error':
        handleOnError();
        break;
      // case 'load':
      //   handleOnLoadEnd();
      //   break;
    }
  };

  const WebViewImageElement = (
    <AnimatedBox style={webViewStyle} renderToHardwareTextureAndroid>
      {isFocused && (
        <WebView
          style={{ opacity: 0.99 }}
          scrollEnabled={false}
          scalesPageToFit={false}
          setBuiltInZoomControls={false}
          useWebView2
          pointerEvents="none"
          ref={webViewRef}
          onMessage={handleOnMessage}
          injectedJavaScriptBeforeContentLoaded={`
       var img = document.getElementById("page");
       img.addEventListener("error", function (err) {
         window.ReactNativeWebView.postMessage(JSON.stringify({ type: "error" }));
       });
       img.addEventListener("load", function () {
         window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load", width: img.naturalWidth, height: img.naturalHeight }));
       })
     `}
          source={{
            html: `
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
      </head>
      <body style="margin: 0;background-color: ${backgroundColor};">
        <img src="${localPageUri}" id="page" style="object-fit: cover;width: ${style.width}px;height: ${style.height}px"  />
      </body>
    </html>
 `,
          }}
        />
      )}
    </AnimatedBox>
  );

  const ImageElement = (
    <Image
      source={{
        uri: localPageUri,
      }}
      style={style}
      onError={handleOnError}
      resizeMode={FastImage.resizeMode.contain}
    />
  );

  const FastImageElement = (
    <FastImage
      source={{
        uri: localPageUri,
      }}
      style={style}
      onError={handleOnError}
    />
  );

  const renderComponent = () => {
    if (error) return null;
    switch (imageComponentType) {
      case ReaderImageComponent.AUTO:
        return fallbackToWebView ? WebViewImageElement : ImageElement;
      case ReaderImageComponent.FAST_IMAGE:
        return FastImageElement;
      case ReaderImageComponent.IMAGE:
        return ImageElement;
      case ReaderImageComponent.WEBVIEW:
        return WebViewImageElement;
    }
  };

  return (
    <Box
      flex-grow
      background-color={backgroundColor}
      justify-content="center"
      align-items="center"
      height={
        readingDirection !== ReadingDirection.WEBTOON ? height : undefined
      }
    >
      <GestureDetector gesture={gestures}>
        <Box style={style} align-self="center">
          {/* <AnimatedBox
          position="absolute"
          align-items="center"
          flex-grow
          top={0}
          left={0}
          right={0}
          bottom={0}
          justify-content="center"
        >
          <Box m="s" p="s" background-color="rgba(0, 0, 0, 0.8)">
            <Text>
              IMAGE DIMENSIONS: {imageWidth} x {imageHeight}
            </Text>
          </Box>
          <Box m="s" p="s" background-color="rgba(0, 0, 0, 0.8)">
            <Text>
              CALCULATED: {width} x {imageHeight * scale}
            </Text>
          </Box>
          <Box m="s" p="s" background-color="rgba(0, 0, 0, 0.8)">
            <Text>
              STYLED: {width} x {stylizedHeight}
            </Text>
          </Box>
        </AnimatedBox> */}
          {renderComponent()}
          {error && (
            <Stack
              style={style}
              space="s"
              position="absolute"
              align-items="center"
              flex-grow
              top={0}
              left={0}
              right={0}
              bottom={0}
              justify-content="center"
              px="m"
            >
              <Icon
                type="font"
                name="wifi-alert"
                color="textSecondary"
                size={moderateScale(128)}
              />
              <Text align="center">There was an error loading this page.</Text>
              <Stack space="s" mx="m" mt="s">
                <Button
                  onPress={handleOnReload}
                  label="Reload page"
                  variant="contained"
                  icon={<Icon type="font" name="refresh" />}
                />
                <Hyperlink url={pageKey} align="center" variant="book-title">
                  Open page in browser
                </Hyperlink>
              </Stack>
            </Stack>
          )}
        </Box>
      </GestureDetector>
    </Box>
  );

  // return (
  //   <GestureDetector gesture={tapGesture}>
  //     <Box justify-content="center">
  //       <AnimatedFastImage
  //         source={{ uri: page }}
  //         style={fastImageStyle}
  //         resizeMode="contain"
  //         onLoadEnd={loadEnd}
  //         onLoad={handleOnLoad}
  //       />

  //       <AnimatedBox
  //         position="absolute"
  //         align-items="center"
  //         flex-grow
  //         top={0}
  //         left={0}
  //         right={0}
  //         bottom={0}
  //         justify-content="center"
  //         style={animatedLoadingStyle}
  //       >
  //         <Progress />
  //       </AnimatedBox>
  //     </Box>
  //   </GestureDetector>
  // );
};

type ParsedWebViewData =
  | { type: 'load'; width: number; height: number }
  | { type: 'error' };

export default connector(React.memo(ChapterPage));
