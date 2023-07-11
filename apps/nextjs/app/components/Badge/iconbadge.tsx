import Image from 'next/image';
import React from 'react';

interface IconBadgeProps extends React.PropsWithChildren {
  src: string;
  alt: string;
}

export default function Badge(props: IconBadgeProps) {
  const { children, src, alt } = props;
  return (
    <div className="relative">
      {children}
      <div className="absolute top-3 right-3 bg-white pointer-events-none rounded">
        <Image width={16} height={16} src={src} alt={alt} className="rounded" />
      </div>
    </div>
  );
}
