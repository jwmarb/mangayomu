import useBoolean from '@app/hooks/useBoolean';
import Image from 'next/image';
import React from 'react';

interface ImageCoverProps {
  imageCover: string;
}

export default function ImageCover(props: ImageCoverProps) {
  const { imageCover } = props;
  const [loaded, toggle] = useBoolean(false);

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
        loading="lazy"
        className={`mx-auto object-contain rounded-lg max-w-full w-40 md:w-52 h-56 md:h-72 top-4 ${
          !loaded ? 'opacity-0 absolute' : ''
        }`}
        alt="Image cover"
      />
    </>
  );
}
