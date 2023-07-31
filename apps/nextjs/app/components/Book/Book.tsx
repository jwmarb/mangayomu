/* eslint-disable @next/next/no-img-element */
import React from 'react';
import type { BookProps } from './';
import Text from '@app/components/Text';
import getMangaHost from '@app/helpers/getMangaHost';
import { IconBadge } from '@app/components/Badge';
import Link from 'next/link';
import getSlug from '@app/helpers/getSlug';
import useBoolean from '@app/hooks/useBoolean';
import { animated, easings, useSpring } from '@react-spring/web';

function Book(props: BookProps) {
  const {
    manga: { source, imageCover, title },
  } = props;
  const host = getMangaHost(source);
  const [{ opacity }, api] = useSpring(() => ({
    opacity: 1,
    config: {
      duration: 500,
      easing: easings.easeInOutBack,
    },
    onChange: (res) => {
      toggle(res.value.opacity > 0);
    },
  }));
  const [loading, toggle] = useBoolean(true);
  return (
    <Link href={`/${getSlug(source)}/${getSlug(title)}`}>
      <IconBadge src={host.icon} alt={source + ' Icon'}>
        <button className="transition duration-250 ease-in-out flex flex-col items-start w-[7rem] sm:w-[7.5rem] md:w-[8.5rem] gap-2 hover:bg-hover active:bg-pressed rounded-lg p-2 focus:bg-hover">
          <div className="w-full md:h-[10.5rem] sm:h-[9.26471rem] h-[8.64706rem] relative">
            <img
              onLoad={() => api.start({ opacity: 0 })}
              loading="lazy"
              src={imageCover}
              alt="cover image"
              className="rounded-lg object-cover w-full h-full"
            />
            {loading && (
              <animated.div
                style={{ opacity }}
                className="skeleton w-full md:h-[10.5rem] sm:h-[9.26471rem] h-[8.64706rem] absolute left-0 top-0 right-0 rounded-lg"
              />
            )}
          </div>
          <Text
            variant="book-title"
            className="text-start break-words line-clamp-2"
          >
            {title}
          </Text>
        </button>
      </IconBadge>
    </Link>
  );
}

export default React.memo(Book);
