import { refetchImage } from './ImageResolver';
import { useLocalRealm } from '@database/main';
import useBoolean from '@hooks/useBoolean';
import { Manga } from '@mangayomu/mangascraper/src';
import { useUser } from '@realm/react';
import React from 'react';
import { useSharedValue } from 'react-native-reanimated';

export default function useImageHandler(props: {
  cover?: string | null | Pick<Manga, 'imageCover'>;
  manga: Manga;
}) {
  const { manga, cover } = props;
  const localRealm = useLocalRealm();
  const user = useUser();
  const src =
    typeof cover === 'string' ? cover : cover?.imageCover ?? manga.imageCover;
  const [imgSrc, setImgSrc] = React.useState<string | undefined | null>(src);
  const [error, toggleError] = useBoolean(src == null);
  const prevImgSrc = React.useRef<string | undefined | null>(src);
  const opacity = useSharedValue(src == null ? 1 : 0);
  const loadingOpacity = useSharedValue(src == null ? 0 : 1);
  if (prevImgSrc.current !== src) {
    prevImgSrc.current = src;
    setImgSrc(src);
    toggleError(false); // reset to default state
    loadingOpacity.value = 1;
    opacity.value = 0;
  }
  React.useEffect(() => {
    if (imgSrc == null) {
      loadingOpacity.value = 0;
      opacity.value = 1;
      toggleError(true);
    } else {
      loadingOpacity.value = 1;
      opacity.value = 0;
    }
  }, [imgSrc]);

  React.useEffect(() => {
    function callback(uri: string | null) {
      setImgSrc(uri);
    }
    if (error && imgSrc != null) {
      const task = refetchImage(localRealm, manga, callback, user);
      return () => {
        task.unsubscribe(callback);
      };
    }
  }, [error]);

  function handleOnError() {
    if (!error) {
      // console.log(`Failed to load image ${imgSrc}`);
      toggleError(true);
    } else {
      // This is run if refetched image fails to load (error will have already been set to true)
      loadingOpacity.value = 0;
      opacity.value = 1;
    }
  }

  function handleOnLoadStart() {
    loadingOpacity.value = 1;
  }

  function handleOnLoad() {
    loadingOpacity.value = 0;
  }

  return {
    onError: handleOnError,
    onLoadStart: handleOnLoadStart,
    onLoad: handleOnLoad,
    source: { uri: imgSrc || undefined },
    loadingOpacity,
    opacity,
    error,
  };
}
