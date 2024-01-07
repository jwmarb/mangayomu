import Box from '@components/Box';
import Divider from '@components/Divider';
import ModalMenu from '@components/ModalMenu';
import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import useAppSelector from '@hooks/useAppSelector';
import { useAppDispatch } from '@redux/main';
import {
  ImageCacheType,
  setImageCacheType,
  toggleImageCaching,
} from '@redux/slices/settings';
import { DIVIDER_DEPTH } from '@theme/constants';
import React from 'react';
import { Pressable } from 'react-native';

const Title = React.memo(() => (
  <Box py="s">
    <Text variant="header" bold>
      Image Caching
    </Text>
    <Text color="textSecondary">Choose whether to opt in image caching</Text>
  </Box>
));

const ImageCachingType = React.memo(() => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const imageCachingType = useAppSelector(
    (state) => state.settings.performance.imageCache.type,
  );
  function handleOnChange(e: ImageCacheType) {
    dispatch(setImageCacheType(e));
  }
  return (
    <ModalMenu
      title="Image Caching Method"
      enum={ImageCacheType}
      value={imageCachingType}
      onChange={handleOnChange}
      trigger={
        <Pressable android_ripple={{ color: theme.palette.action.ripple }}>
          <Stack
            ml="m"
            border-width={{ l: DIVIDER_DEPTH }}
            border-color="@theme"
            flex-direction="row"
            space="s"
            justify-content="space-between"
            align-items="center"
            p="m"
          >
            <Text>Cache Method</Text>
            <Text color="primary" variant="button" bold>
              {imageCachingType}
            </Text>
          </Stack>
        </Pressable>
      }
    />
  );
});

export default function ImageCaching() {
  const theme = useTheme();
  const imageCachingEnabled = useAppSelector(
    (state) => state.settings.performance.imageCache.enabled,
  );
  const dispatch = useAppDispatch();
  function handleOnChange() {
    dispatch(toggleImageCaching());
  }

  return (
    <>
      <Title />
      <Box
        background-color="paper"
        border-radius="@theme"
        border-width="@theme"
        border-color="@theme"
        overflow="hidden"
      >
        <Pressable
          android_ripple={{
            color: theme.palette.action.ripple,
          }}
          onPress={handleOnChange}
        >
          <Stack
            flex-direction="row"
            space="s"
            align-items="center"
            justify-content="space-between"
            p="m"
          >
            <Text>Enable Image Caching</Text>
            <Switch enabled={imageCachingEnabled} onChange={handleOnChange} />
          </Stack>
        </Pressable>
        {!imageCachingEnabled ? (
          <>
            <Divider />
            <Box p="m">
              <Text color="textSecondary">
                Disabling this can lead to a less smooth experience.
              </Text>
            </Box>
          </>
        ) : (
          <ImageCachingType />
        )}
      </Box>
    </>
  );
}
