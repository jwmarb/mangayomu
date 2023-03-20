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
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import useMountedEffect from '@hooks/useMountedEffect';
import connector, { ConnectedChapterPageProps } from './ChapterPage.redux';
import Icon from '@components/Icon';
import { moderateScale } from 'react-native-size-matters';
import Stack from '@components/Stack';
import Hyperlink from '@components/Hyperlink';
import Button from '@components/Button';
import Divider from '@components/Divider';
import { useLocalObject, useLocalRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { PageSchema } from '@database/schemas/Page';

function removeURLParams(url: string) {
  const startParam = url.indexOf('?');
  if (startParam === -1) return url;
  return url.substring(0, startParam);
}

const ChapterPage: React.FC<ConnectedChapterPageProps> = (props) => {
  const { mangaKey } = props;
  const { width, height } = useWindowDimensions();
  const { tapGesture } = props;
  const { page: pageKey, chapter: chapterKey } = props.page;
  const localRealm = useLocalRealm();
  const parsedPageKey = removeURLParams(pageKey);
  const page = useLocalObject(PageSchema, parsedPageKey);

  // const [imageDimensions, setImageDimensions] = React.useState<{
  //   width: number;
  //   height: number;
  // }>({ width, height });
  const imageWidth = useSharedValue(page?.width ?? width);
  const imageHeight = useSharedValue(page?.height ?? height);
  const [error, setError] = React.useState<boolean>(false);
  // const scale = React.useMemo(
  //   () => width / imageDimensions.width,
  //   [width, imageDimensions.width],
  // );
  const scale = useDerivedValue(() => width / imageWidth.value);
  const opacity = useSharedValue(0);
  const loadingOpacity = useSharedValue(1);
  // const style = React.useMemo(
  //   () => ({
  //     width,
  //     height:
  //       scale *
  //       (StatusBar.currentHeight
  //         ? StatusBar.currentHeight + imageDimensions.height
  //         : imageDimensions.height),
  //   }),
  //   [imageDimensions, scale, width],
  // );
  const style = useAnimatedStyle(() => ({
    width,
    height: scale.value * imageHeight.value,
  }));
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

  function loadEnd() {
    opacity.value = 1;
    loadingOpacity.value = 0;
  }

  function handleOnLoad(e: OnLoadEvent) {
    imageWidth.value = e.nativeEvent.width;
    imageHeight.value = e.nativeEvent.height;
    // setImageDimensions({
    //   width: e.nativeEvent.width,
    //   height: e.nativeEvent.height,
    // });
  }

  function writeImageDimensionsLocally(
    parsedWidth: number,
    parsedHeight: number,
  ) {
    localRealm.write(() => {
      localRealm.create<PageSchema>(
        'Page',
        {
          _id: parsedPageKey,
          _chapterId: chapterKey,
          _mangaId: mangaKey,
          width: parsedWidth,
          height: parsedHeight,
        },
        Realm.UpdateMode.Modified,
      );
    });
  }

  React.useEffect(() => {
    return () => {
      const isScreenDimension =
        imageWidth.value === width && imageHeight.value === height;
      if (!isScreenDimension)
        writeImageDimensionsLocally(imageWidth.value, imageHeight.value);
    };
  }, []);

  const handleOnMessage = React.useCallback(
    (e: WebViewMessageEvent) => {
      const parsed: ParsedWebViewData = JSON.parse(e.nativeEvent.data);
      switch (parsed.type) {
        case 'load':
          imageWidth.value = parsed.width;
          imageHeight.value = parsed.height;
          opacity.value = 1;

          break;
        case 'error':
          setError(true);
          break;
      }
      loadingOpacity.value = 0;
    },
    [setError],
  );

  // useMountedEffect(() => {
  //   loadEnd();
  // }, [imageDimensions]);

  const webViewRef = React.useRef<WebView>(null);
  function handleOnReload() {
    setError(false);
    loadingOpacity.value = 1;
    opacity.value = 0;
    webViewRef.current?.reload();
  }

  // useMountedEffect(() => {
  //   webViewRef.current?.reload();
  // }, [backgroundColor]);

  return (
    <GestureDetector gesture={tapGesture}>
      <Box width={width} minHeight={height} justify-content="center">
        <AnimatedBox style={fastImageStyle}>
          {React.useMemo(
            () => (
              <WebView
                useWebView2
                ref={webViewRef}
                onMessage={handleOnMessage}
                scalesPageToFit={false}
                injectedJavaScript={`
          var img = document.getElementById("page");
          if (img.naturalWidth !== 0 && img.naturalHeight !== 0) window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load", width: img.naturalWidth, height: img.naturalHeight }));
        `}
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
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
            <head />
            <body style="margin: 0;display: flex;flex-direction: row;justify-content: center;align-items: center;background-color: rgba(0, 0, 0, 0);">
              <img src="${pageKey}" width="100%" id="page" style="object-fit: contain;"  />
            </body>
          </html>
        `,
                }}
              />
            ),
            [handleOnMessage, pageKey],
          )}
        </AnimatedBox>
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
        {error && (
          <Stack
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
          </Stack>
        )}
      </Box>
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
