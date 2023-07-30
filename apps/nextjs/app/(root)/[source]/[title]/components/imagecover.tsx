import Image from 'next/image';
import React from 'react';

interface ImageCoverProps {
  imageCover: string;
}

export default function ImageCover(props: ImageCoverProps) {
  const { imageCover } = props;

  return (
    <Image
      width={768}
      height={768}
      src={imageCover}
      loading="lazy"
      className="mx-auto object-contain rounded-lg max-w-full w-40 md:w-52 top-4"
      alt="Image cover"
    />
  );
}
