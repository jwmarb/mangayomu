import { useImageResolver } from '@app/context/imageresolver';
import useBoolean from '@app/hooks/useBoolean';
import { Manga } from '@mangayomu/mangascraper';
import Image from 'next/image';
import React from 'react';

interface ImageCoverProps {
  imageCover: string;
  setImageCover: React.Dispatch<React.SetStateAction<string>>;
  manga: Manga;
}

export default function ImageCover(props: ImageCoverProps) {
  const { imageCover, manga, setImageCover } = props;
  const [loaded, toggle] = useBoolean(false);
  const [error, toggleError] = useBoolean(false);
  const resolveImage = useImageResolver((s) => s.queue);

  React.useEffect(() => {
    if (error) {
      const { unqueue } = resolveImage(manga, (r) => setImageCover(r));
      return () => {
        unqueue();
      };
    }
  }, [error, manga, resolveImage, setImageCover]);

  return (
    <>
      {!loaded && (
        <div className="skeleton w-40 md:w-52 h-56 md:h-72 mx-auto rounded-lg" />
      )}
      <Image
        width={768}
        height={768}
        src={imageCover}
        onLoadingComplete={() => toggle(true)}
        onError={() => toggleError(true)}
        loading="lazy"
        className={`mx-auto object-contain rounded-lg max-w-full w-40 md:w-52 h-56 md:h-72 top-4 ${
          !loaded ? 'opacity-0 absolute' : ''
        }`}
        alt="Image cover"
      />
    </>
  );
}
