import React from 'react';
import connector, {
  ConnectedWebViewImageElementProps,
} from './WebViewImageElement.redux';
import { AnimatedBox } from '@components/Box';
import WebView from 'react-native-webview';

const WebViewImageElement: React.ForwardRefRenderFunction<
  WebView,
  ConnectedWebViewImageElementProps
> = (props, ref) => {
  const { style, onMessage, uri, backgroundColor } = props;
  return (
    <AnimatedBox style={style} renderToHardwareTextureAndroid>
      <WebView
        style={{ opacity: 0.99 }}
        scrollEnabled={false}
        scalesPageToFit={false}
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
          <img src="${uri}" id="page" style="object-fit: cover;width: ${style.width}px;height: ${style.height}px"  />
        </body>
      </html>
   `,
        }}
      />
    </AnimatedBox>
  );
};

export default connector(React.forwardRef(WebViewImageElement));
