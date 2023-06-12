import Box, { AnimatedBox } from '@components/Box';
import Icon from '@components/Icon';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useLocalRealm } from '@database/main';
import { PageSchema } from '@database/schemas/Page';
import { useTheme } from '@emotion/react';
import { Portal } from '@gorhom/portal';
import displayMessage from '@helpers/displayMessage';
import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import React from 'react';
import {
  LayoutChangeEvent,
  Share,
  Platform,
  Linking,
  Dimensions,
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
import connected, { ConnectedImageMenuProps } from './ImageMenu.redux';
const ImageMenu: React.FC<ConnectedImageMenuProps> = (props) => {
  const { pageInDisplay, toggleImageModal, show } = props;
  const localRealm = useLocalRealm();
  const theme = useTheme();
  const [width, setWidth] = React.useState<number>(
    Dimensions.get('screen').width,
  );
  const [height, setHeight] = React.useState<number>(
    Dimensions.get('screen').height,
  );
  React.useEffect(() => {
    const p = Dimensions.addEventListener('change', ({ screen }) => {
      setWidth(screen.width);
      setHeight(screen.height);
    });
    return () => {
      p.remove();
    };
  }, []);
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

  React.useEffect(() => {
    if (show) {
      translationY.value = withTiming(0, {
        duration: 150,
        easing: Easing.ease,
      });
      ReactNativeHapticFeedback.trigger('impactHeavy', {
        enableVibrateFallback: true,
      });
    } else {
      translationY.value = withTiming(containerHeight, {
        duration: 150,
        easing: Easing.ease,
      });
    }
  }, [show]);
  React.useEffect(() => {
    if (pageInDisplay != null) {
      setURL(pageInDisplay.url);
      setPage(
        localRealm.objectForPrimaryKey(PageSchema, pageInDisplay.parsedKey),
      );
    }
  }, [pageInDisplay]);
  function handleOnClose() {
    toggleImageModal(false);
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
  function handleOnLongPressViewInBrowser() {
    displayMessage('View in browser');
  }
  async function handleOnViewInBrowser() {
    if (url && (await Linking.canOpenURL(url))) await Linking.openURL(url);
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
        pointerEvents={show ? 'auto' : 'none'}
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
                shouldCancelWhenOutside
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
                shouldCancelWhenOutside
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
              <RectButton
                shouldCancelWhenOutside
                rippleColor={theme.palette.action.ripple}
                onPress={handleOnViewInBrowser}
                onLongPress={handleOnLongPressViewInBrowser}
              >
                <Stack
                  space="l"
                  m="m"
                  flex-direction="row"
                  align-items="center"
                >
                  <Icon type="font" name="web" size={moderateScale(24)} />
                  <Text variant="button">Open in browser</Text>
                </Stack>
              </RectButton>
            </AnimatedBox>
          </AnimatedBox>
        </TouchableWithoutFeedback>
      </Box>
    </Portal>
  );
};

export default connected(React.memo(ImageMenu));
