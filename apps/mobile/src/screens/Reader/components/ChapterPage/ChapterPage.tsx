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
import { ReadingDirection } from '@redux/slices/settings';

export function removeURLParams(url: string) {
  const startParam = url.indexOf('?');
  if (startParam === -1) return url;
  return url.substring(0, startParam);
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

const AnimatedFastImage = Animated.createAnimatedComponent(
  FastImage as React.FC<FastImageProps>,
);

const ChapterPage: React.FC<ConnectedChapterPageProps> = (props) => {
  const { imageMenuRef, tapGesture, readingDirection } =
    useChapterPageContext();
  const { width, height } = useWindowDimensions();
  const { page: pageKey } = props.page;
  const { backgroundColor } = props;
  const parsedPageKey = removeURLParams(pageKey);
  const webViewRef = React.useRef<WebView>(null);
  const imageWidth = props.page.width;
  const imageHeight = props.page.height;
  const scale = width / imageWidth;
  const stylizedHeight = ReadingDirection.WEBTOON
    ? scale * imageHeight
    : height;
  const [error, setError] = React.useState<boolean>(false);
  /**
   * In the case of very large images which can be observed in some webtoons (e.g. images that exceed the device's height by 5-8 times),
   * Image performs downsampling on the image, reducing its quality that could make its text unreadable or its content uncomprehensible. As a workaround, the page will fallback to using WebView, which is
   * much slower, however, maintains the best image quality.
   */
  const fallbackToWebView = stylizedHeight / height > 1;

  // const loadingOpacity = useSharedValue(1);
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
    setError(false);
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
    setError(true);
    // loadingOpacity.value = 0;
    visibleWithoutErrorOpacity.value = 0;
  }

  const holdGesture = React.useMemo(
    () =>
      Gesture.LongPress().onStart(() => {
        if (imageMenuRef.current != null)
          runOnJS(imageMenuRef.current.open)(parsedPageKey, pageKey);
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

  return (
    <Box
      flex-grow
      background-color={backgroundColor}
      justify-content="center"
      align-items="center"
    >
      <GestureDetector gesture={gestures}>
        <Box style={style} align-self="center">
          {fallbackToWebView ? (
            <AnimatedBox style={webViewStyle}>
              <WebView
                androidLayerType="hardware"
                ref={webViewRef}
                onMessage={handleOnMessage}
                //         injectedJavaScript={`
                //   var img = document.getElementById("page");
                //   if (img.naturalWidth !== 0 && img.naturalHeight !== 0) window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load", width: img.naturalWidth, height: img.naturalHeight }));
                // `}
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
           <body style="margin: 0;background-color: ${backgroundColor};">
             <img src="${pageKey}" width="100%" id="page" style="object-fit: contain;"  />
           </body>
         </html>
       `,
                }}
              />
            </AnimatedBox>
          ) : (
            <>
              {!error && (
                <Image
                  // onLoadStart={handleOnLoadStart}
                  source={{
                    uri: pageKey,
                  }}
                  style={style}
                  // onLoadEnd={handleOnLoadEnd}
                  onError={handleOnError}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
            </>
          )}
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
