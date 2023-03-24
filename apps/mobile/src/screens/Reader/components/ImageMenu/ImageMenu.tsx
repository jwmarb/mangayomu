import Box, { AnimatedBox } from '@components/Box';
import { CustomBottomSheet } from '@components/CustomBottomSheet';
import Icon from '@components/Icon';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useLocalRealm } from '@database/main';
import { PageSchema } from '@database/schemas/Page';
import { useTheme } from '@emotion/react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Portal } from '@gorhom/portal';
import displayMessage from '@helpers/displayMessage';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import React from 'react';
import {
  LayoutChangeEvent,
  Share,
  useWindowDimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  RectButton,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import RNFetchBlob from 'rn-fetch-blob';
import { ImageMenuMethods } from './ImageMenu.interfaces';
const ImageMenu: React.ForwardRefRenderFunction<ImageMenuMethods> = (
  props,
  ref,
) => {
  const localRealm = useLocalRealm();
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const [page, setPage] = React.useState<PageSchema>();
  const [url, setURL] = React.useState<string>();
  const [containerHeight, setContainerHeight] = React.useState<number>(2000);
  const translationY = useSharedValue(containerHeight);
  const backgroundColor = useDerivedValue(
    () =>
      interpolateColor(
        translationY.value,
        [0, containerHeight],
        ['rgba(0, 0, 0, 0.7)', 'transparent'],
      ),
    [containerHeight],
  );
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translationY.value }],
  }));
  const overlayStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));
  React.useImperativeHandle(ref, () => ({
    open(pageKey, pageURL) {
      setPage(localRealm.objectForPrimaryKey(PageSchema, pageKey));
      translationY.value = withTiming(0, {
        duration: 150,
        easing: Easing.ease,
      });
      setURL(pageURL);
      ReactNativeHapticFeedback.trigger('impactHeavy', {
        enableVibrateFallback: true,
      });
    },
  }));
  function handleOnClose() {
    setPage(undefined);
    setURL(undefined);
    translationY.value = withTiming(containerHeight, {
      duration: 150,
      easing: Easing.ease,
    });
  }
  async function handleOnShare() {
    if (url != null) {
      try {
        await Share.share({ url, message: url });
      } catch (e) {
        displayMessage('Failed to share image.');
      } finally {
        handleOnClose();
      }
    }
  }

  async function handleOnSaveImage() {
    if (page != null && url != null) {
      handleOnClose();
      const path =
        Platform.OS === 'ios'
          ? RNFetchBlob.fs.dirs['MainBundleDir'] +
            page._id.substring(page._id.lastIndexOf('/'))
          : RNFetchBlob.fs.dirs['PictureDir'] +
            page._id.substring(page._id.lastIndexOf('/'));
      if (Platform.OS === 'android') {
        RNFetchBlob.config({
          fileCache: true,
          path,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path,
            description: 'Downloading image',
          },
        })
          .fetch('GET', url)
          .then((res) => {
            CameraRoll.save(res.data, { type: 'photo' })
              .then(() => displayMessage('Image saved.'))
              .catch(() => displayMessage('Failed to save image.'));
          })
          .catch(() => displayMessage('Failed to save image.'));
      } else
        CameraRoll.save(url, { type: 'photo' })
          .then(() => displayMessage('Image saved.'))
          .catch(() => displayMessage('Failed to save image.'));
    }
  }

  function handleOnLongPressShare() {
    displayMessage('Share image');
  }
  function handleOnLongPressSaveImage() {
    displayMessage('Save image');
  }
  function handleOnLayout(e: LayoutChangeEvent) {
    setContainerHeight(e.nativeEvent.layout.height);
    translationY.value = e.nativeEvent.layout.height;
  }
  return (
    <Portal>
      <Box
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        top={0}
        pointerEvents={page != null ? 'auto' : 'none'}
      >
        <TouchableWithoutFeedback onPress={handleOnClose}>
          <AnimatedBox
            style={overlayStyle}
            width={width}
            height={height}
            justify-content="flex-end"
          >
            <AnimatedBox
              style={style}
              onLayout={handleOnLayout}
              border-radius={{
                tl: theme.style.spacing.m,
                tr: theme.style.spacing.m,
              }}
              background-color="paper"
            >
              <RectButton
                rippleColor={theme.palette.action.ripple}
                onLongPress={handleOnLongPressSaveImage}
                onPress={handleOnSaveImage}
              >
                <Stack
                  space="l"
                  m="m"
                  flex-direction="row"
                  align-items="center"
                >
                  <Icon type="font" name="image" size={moderateScale(24)} />
                  <Text variant="button">Save image</Text>
                </Stack>
              </RectButton>
              <RectButton
                rippleColor={theme.palette.action.ripple}
                onPress={handleOnShare}
                onLongPress={handleOnLongPressShare}
              >
                <Stack
                  space="l"
                  m="m"
                  flex-direction="row"
                  align-items="center"
                >
                  <Icon
                    type="font"
                    name="share-variant"
                    size={moderateScale(24)}
                  />
                  <Text variant="button">Share</Text>
                </Stack>
              </RectButton>
            </AnimatedBox>
          </AnimatedBox>
        </TouchableWithoutFeedback>
      </Box>
    </Portal>
  );
};

export default React.memo(React.forwardRef(ImageMenu));
