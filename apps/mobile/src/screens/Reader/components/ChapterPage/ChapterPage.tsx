import React from 'react';
import { useWindowDimensions } from 'react-native';
import FastImage, {
  FastImageProps,
  OnLoadEvent,
} from 'react-native-fast-image';
import { ChapterPageProps } from './ChapterPage.interfaces';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import Box, { AnimatedBox } from '@components/Box';
import Text from '@components/Text';
import Progress from '@components/Progress';
import { useTheme } from '@emotion/react';
import { StatusBar } from 'react-native';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import useMountedEffect from '@hooks/useMountedEffect';

const AnimatedFastImage = Animated.createAnimatedComponent(
  FastImage as React.FC<FastImageProps>,
);

const ChapterPage: React.FC<ChapterPageProps> = (props) => {
  const { width, height } = useWindowDimensions();
  const { tapGesture } = props;
  const [imageDimensions, setImageDimensions] = React.useState<{
    width: number;
    height: number;
  }>({ width, height });
  const [error, setError] = React.useState<boolean>(false);
  const scale = React.useMemo(
    () => width / imageDimensions.width,
    [width, imageDimensions.width],
  );
  const opacity = useSharedValue(0);
  const loadingOpacity = useSharedValue(1);
  const style = React.useMemo(
    () => ({
      width,
      height:
        scale *
        (StatusBar.currentHeight
          ? StatusBar.currentHeight + imageDimensions.height
          : imageDimensions.height),
    }),
    [imageDimensions, scale, width],
  );
  const animatedMountStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const fastImageStyle = React.useMemo(
    () => [style, animatedMountStyle],
    [style, animatedMountStyle],
  );
  const animatedLoadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));
  const { page } = props.page;

  function loadEnd() {
    console.log('loadEnd() called');
    opacity.value = 1;
    loadingOpacity.value = 0;
  }

  function handleOnLoad(e: OnLoadEvent) {
    setImageDimensions({
      width: e.nativeEvent.width,
      height: e.nativeEvent.height,
    });
  }

  // useAnimatedReaction(
  //   () => opacity.value,
  //   (result) => {
  //     console.log('opacity = ' + result);
  //   },
  // );

  // function handleOnMessage(e: WebViewMessageEvent) {
  //   const parsed: ParsedWebViewData = JSON.parse(e.nativeEvent.data);

  //   switch (parsed.type) {
  //     case 'load':
  //       console.log('setImageDimensions called');
  //       setImageDimensions({
  //         width: parsed.width,
  //         height: parsed.height,
  //       });

  //       break;
  //     case 'error':
  //       setError(true);
  //       break;
  //   }
  // }
  // useMountedEffect(() => {
  //   loadEnd();
  // }, [imageDimensions]);

  // const webViewRef = React.useRef<WebView>(null);

  // return (
  //   <AnimatedBox style={fastImageStyle}>
  //     <WebView
  //       ref={webViewRef}
  //       onMessage={handleOnMessage}
  //       injectedJavaScriptBeforeContentLoaded={`
  //         var img = document.getElementById("page");
  //         img.addEventListener("error", function (err) {
  //           window.ReactNativeWebView.postMessage(JSON.stringify({ type: "error" }));
  //         });
  //         img.addEventListener("load", function () {
  //           window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load", width: img.naturalWidth, height: img.naturalHeight }));
  //         })
  //       `}
  //       source={{
  //         html: `
  //         <html>
  //           <head>
  //             <meta name="viewport" content="initial-scale=0.5, maximum-scale=2.0">
  //           <head />
  //           <body style="margin: 0;">
  //             <img src="${page}" width="100%" id="page" />
  //           </body>
  //         </html>
  //       `,
  //       }}
  //     />
  //   </AnimatedBox>
  // );

  return (
    <GestureDetector gesture={tapGesture}>
      <Box justify-content="center">
        <AnimatedFastImage
          source={{ uri: page }}
          style={fastImageStyle}
          resizeMode="contain"
          onLoadEnd={loadEnd}
          onLoad={handleOnLoad}
        />

        <AnimatedBox
          position="absolute"
          align-items="center"
          flex-grow
          top={0}
          left={0}
          right={0}
          bottom={0}
          justify-content="center"
          style={animatedLoadingStyle}
        >
          <Progress />
        </AnimatedBox>
      </Box>
    </GestureDetector>
  );
};

type ParsedWebViewData =
  | { type: 'load'; width: number; height: number }
  | { type: 'error' };

export default React.memo(ChapterPage);
