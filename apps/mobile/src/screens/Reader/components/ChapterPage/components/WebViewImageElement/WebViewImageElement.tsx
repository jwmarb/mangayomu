import React from 'react';
import connector, {
  ConnectedWebViewImageElementProps,
} from './WebViewImageElement.redux';
import Box, { AnimatedBox } from '@components/Box';
import WebView from 'react-native-webview';
import { ViewStyle } from 'react-native';

const WebViewImageElement: React.ForwardRefRenderFunction<
  WebView,
  ConnectedWebViewImageElementProps
> = (props, ref) => {
  const { style, onMessage, uri, backgroundColor, animatedStyle } = props;
  return (
    <AnimatedBox
      style={animatedStyle as ViewStyle}
      renderToHardwareTextureAndroid
    >
      <WebView
        androidLayerType="hardware"
        style={{ opacity: 0.99 }}
        scrollEnabled={false}
        scalesPageToFit={false}
        setDisplayZoomControls={false}
        nestedScrollEnabled={false}
        setBuiltInZoomControls={false}
        useWebView2
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
        source={{
          html: `
      <html>
        <head>
          <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        </head>
        <body style="margin: 0;background-color: ${backgroundColor};">
          <img src="${uri}" id="page" style="pointer-events: none;object-fit: contain;width: ${style.width}px;height: ${style.height}px"  />
        </body>
      </html>
   `,
        }}
      />
    </AnimatedBox>
  );
};

export default connector(React.forwardRef(WebViewImageElement));
