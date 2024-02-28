import React from 'react';
import connector, {
  ConnectedWebViewImageElementProps,
} from './WebViewImageElement.redux';
import Box, { AnimatedBox } from '@components/Box';
import WebView from 'react-native-webview';
import { ViewStyle } from 'react-native';
import Progress from '@components/Progress';

const WebViewImageElement: React.ForwardRefRenderFunction<
  WebView,
  ConnectedWebViewImageElementProps
> = (props, ref) => {
  const { style, onMessage, uri, backgroundColor, animatedStyle } = props;
  return (
    <AnimatedBox
      style={animatedStyle as ViewStyle}
      pointerEvents="none"
      renderToHardwareTextureAndroid
    >
      <WebView
        allowFileAccess
        scrollEnabled={false}
        scalesPageToFit={false}
        setDisplayZoomControls={false}
        nestedScrollEnabled={false}
        setBuiltInZoomControls={false}
        pointerEvents="none"
        ref={ref}
        onMessage={onMessage}
        injectedJavaScriptBeforeContentLoaded={`
         var img = document.getElementById("page");
         img.addEventListener("error", function (err) {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: "error" }));
         });
         img.addEventListener("load", function () {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: "load", width: img.naturalWidth, height: img.naturalHeight }));
         })
       `}
        startInLoadingState
        renderLoading={renderLoading}
        source={{
          html: `
      <html>
        <head>
          <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        </head>
        <style>
          body {
            margin: 0;
            background-color: ${backgroundColor};
            width: ${style.width}px;
            height: ${style.height}px;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        </style>
        <body>
          <img src="${uri}" id="page">
        </body>
      </html>
   `,
        }}
      />
    </AnimatedBox>
  );
};

const renderLoading = () => (
  <Box
    position="absolute"
    left={0}
    right={0}
    bottom={0}
    top={0}
    align-items="center"
    justify-content="center"
  >
    <Progress />
  </Box>
);

export default connector(React.forwardRef(WebViewImageElement));
