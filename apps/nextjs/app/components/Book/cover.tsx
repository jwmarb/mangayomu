import React from 'react';
import { animated, easings, useSpring } from '@react-spring/web';
import { useImageResolver } from '@app/context/imageresolver';
import useBoolean from '@app/hooks/useBoolean';
import { Manga } from '@mangayomu/mangascraper';
import Link from 'next/link';
import getSlug from '@app/helpers/getSlug';

interface CoverProps {
  manga: Manga;
  standalone?: boolean;
  compact?: boolean;
}

export default function Cover(props: CoverProps) {
  const width = props.compact
    ? 'w-[4.45238rem]'
    : 'w-[7rem] sm:w-[7.5rem] md:w-[8.5rem]';
  const height = props.compact
    ? 'h-[5.5rem]'
    : 'md:h-[10.5rem] sm:h-[9.26471rem] h-[8.64706rem]';
  const resolveImage = useImageResolver((state) => state.queue);
  const [imageCover, setImageCover] = React.useState<string | null>(
    props.manga.imageCover,
  );
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
  const [error, toggleError] = useBoolean();
  const handleOnError = () => {
    toggleError(true);
  };

  React.useEffect(() => {
    if (error) {
      const { unqueue } = resolveImage(props.manga, (r) => setImageCover(r));
      return () => {
        unqueue();
      };
    }
  }, [error, props.manga, resolveImage]);
  if (props.standalone)
    return (
      <button
        className={`transition duration-250 ease-in-out flex flex-col items-start ${width} gap-2 hover:bg-hover active:bg-pressed rounded-lg ${
          props.compact ? 'p-1' : 'p-2'
        } focus:bg-hover`}
      >
        <Link
          href={`/${getSlug(props.manga.source)}/${getSlug(props.manga.title)}`}
        >
          <div className={`${height} relative w-full -z-50`}>
            <img
              onLoad={() => api.start({ opacity: 0 })}
              onError={handleOnError}
              loading="lazy"
              src={imageCover || '/No-Image-Placeholder.png'}
              alt="cover image"
              className="rounded-lg object-cover w-full h-full"
            />
            {loading && (
              <animated.div
                style={{ opacity }}
                className={`skeleton w-full ${height} absolute left-0 top-0 right-0 rounded-lg`}
              />
            )}
          </div>
        </Link>
      </button>
    );
  return (
    <div className={`${height} relative w-full`}>
      <img
        onLoad={() => api.start({ opacity: 0 })}
        onError={handleOnError}
        loading="lazy"
        src={imageCover || '/No-Image-Placeholder.png'}
        alt="cover image"
        className="rounded-lg object-cover w-full h-full"
      />
      {loading && (
        <animated.div
          style={{ opacity }}
          className={`skeleton w-full ${height} absolute left-0 top-0 right-0 rounded-lg`}
        />
      )}
    </div>
  );
}
