import React from 'react';
import { useWindowDimensions } from 'react-native';
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
  const { imageMenuRef, tapGesture } = useChapterPageContext();
  const { width } = useWindowDimensions();
  const { page: pageKey } = props.page;
  const parsedPageKey = removeURLParams(pageKey);
  const imageWidth = useSharedValue(props.page.width);
  const imageHeight = useSharedValue(props.page.height);
  const [error, setError] = React.useState<boolean>(false);

  const scale = useDerivedValue(() => width / imageWidth.value);
  const loadingOpacity = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    width,
    height: scale.value * imageHeight.value,
  }));

  const animatedLoadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  function handleOnReload() {
    setError(false);
    loadingOpacity.value = 1;
  }

  function handleOnLoadEnd() {
    loadingOpacity.value = 0;
  }
  function handleOnLoadStart() {
    loadingOpacity.value = 1;
  }
  function handleOnError() {
    setError(true);
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

  return (
    <GestureDetector gesture={gestures}>
      <AnimatedBox style={style} align-self="center">
        {!error && (
          <AnimatedFastImage
            onLoadStart={handleOnLoadStart}
            source={{ uri: pageKey }}
            style={style}
            onLoadEnd={handleOnLoadEnd}
            onError={handleOnError}
          />
        )}
        {/* <AnimatedBox style={fastImageStyle}>
          <WebView
            androidLayerType="hardware"
            ref={webViewRef}
            // onMessage={handleOnMessage}
            //         injectedJavaScript={`
            //   var img = document.getElementById("page");
            //   if (img.naturalWidth !== 0 && img.naturalHeight !== 0) window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load", width: img.naturalWidth, height: img.naturalHeight }));
            // `}
            //         injectedJavaScriptBeforeContentLoaded={`
            //   var img = document.getElementById("page");
            //   img.addEventListener("error", function (err) {
            //     window.ReactNativeWebView.postMessage(JSON.stringify({ type: "error" }));
            //   });
            //   img.addEventListener("load", function () {
            //     window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load", width: img.naturalWidth, height: img.naturalHeight }));
            //   })
            // `}
            source={{
              html: `
          <html>
            <body style="margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;background-color: rgba(0, 0, 0, 0);">
              <img src="${pageKey}" width="${props.page.width}px" height="${props.page.height}px" id="page" style="object-fit: contain;"  />
            </body>
          </html>
        `,
            }}
          />
        </AnimatedBox> */}
        <AnimatedBox
          style={animatedLoadingStyle}
          position="absolute"
          align-items="center"
          flex-grow
          top={0}
          left={0}
          right={0}
          bottom={0}
          justify-content="center"
        >
          <Progress />
        </AnimatedBox>
        {error && (
          <AnimatedStack
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
            mx="m"
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
              <Hyperlink url={pageKey} align="center">
                Open page in browser
              </Hyperlink>
            </Stack>
          </AnimatedStack>
        )}
      </AnimatedBox>
    </GestureDetector>
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
