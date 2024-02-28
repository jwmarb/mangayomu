import Box from '@components/Box';
import Divider from '@components/Divider';
import CacheManager from '@components/ImprovedImage/CacheManager';
import ModalMenu from '@components/ModalMenu';
import Pressable from '@components/Pressable';
import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import useAppSelector from '@hooks/useAppSelector';
import { useAppDispatch } from '@redux/main';
import {
  ImageCacheType,
  setImageCacheType,
  toggleImageCaching,
} from '@redux/slices/settings';
import toReadableBytes from '@screens/Performance/helpers/toReadableBytes';
import { DIVIDER_DEPTH } from '@theme/constants';
import { IMAGE_CACHE_DIR } from 'env';
import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';

const Title = React.memo(() => (
  <Box py="s">
    <Text variant="header" bold>
      Image Caching
    </Text>
    <Text color="textSecondary">Choose whether to opt in image caching</Text>
  </Box>
));

const ImageCachingType = React.memo(() => {
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
        <Pressable>
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

const ClearCache = React.memo(() => {
  const [spaceOccupied, setSpaceOccupied] = React.useState<
    number | undefined
  >(); // in bytes
  React.useEffect(() => {
    if (spaceOccupied == null)
      RNFetchBlob.fs
        .ls(IMAGE_CACHE_DIR)
        .then((files) =>
          Promise.all(
            files.map((file) =>
              RNFetchBlob.fs.stat(`${IMAGE_CACHE_DIR}/${file}`),
            ),
          ),
        )
        .then((stats) => {
          let inc = 0;
          for (let i = 0; i < stats.length; i++) {
            inc += stats[i].size;
          }
          return inc;
        })
        .then(setSpaceOccupied);
  }, [spaceOccupied]);
  async function clearCache() {
    await RNFetchBlob.fs.unlink(IMAGE_CACHE_DIR);
    CacheManager.memoryCache.clear();
    setSpaceOccupied(0);
    await RNFetchBlob.fs.mkdir(IMAGE_CACHE_DIR);
  }
  const occupied = React.useMemo(() => {
    if (spaceOccupied == null) return 'Calculating...';

    return toReadableBytes(spaceOccupied);
  }, [spaceOccupied]);
  return (
    <>
      <Divider />
      <Pressable onPress={clearCache}>
        <Stack
          p="m"
          space="s"
          justify-content="space-between"
          align-items="center"
          flex-direction="row"
        >
          <Text>Clear Cache</Text>
          <Text color="textSecondary">{occupied}</Text>
        </Stack>
      </Pressable>
    </>
  );
});

export default function ImageCaching() {
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
        <Pressable onPress={handleOnChange}>
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
        <ClearCache />
      </Box>
    </>
  );
}
