/* eslint-disable @next/next/no-img-element */
'use client';
import Button from '@app/components/Button';
import Checkbox from '@app/components/Checkbox';
import Text from '@app/components/Text';
import { useAddedSources } from '@app/context/sources';
import { MangaHost } from '@mangayomu/mangascraper';
import Link from 'next/link';
import React from 'react';
import { shallow } from 'zustand/shallow';
import { MdLink, MdOutlineSettings } from 'react-icons/md';

interface SourceProps {
  source: string;
  isSelected: boolean;
}

function Source(props: SourceProps) {
  const { source: strSource, isSelected } = props;
  const [addSource, removeSource] = useAddedSources(
    (store) => [store.addSource, store.removeSource],
    shallow,
  );

  const highlight = isSelected ? 'border-primary/[0.5]' : 'border-default';

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const source = MangaHost.sourcesMap.get(strSource)!;
  return (
    <div className={`transition duration-250 flex flex-col ${highlight}`}>
      <button
        onClick={() => {
          if (isSelected) removeSource(strSource);
          else addSource(strSource);
        }}
        className={`transition border-2 rounded-t-lg rounded-bl-lg ${highlight} focus:outline focus:outline-4 focus:outline-primary/[.3] bg-paper duration-250 hover:bg-primary/[0.1] focus:bg-primary/[0.1] p-2 flex flex-grow flex-row justify-between items-center`}
      >
        <div className="flex flex-row space-x-4">
          <img
            loading="lazy"
            src={source.icon}
            alt={`${source.name} icon`}
            className="w-16 h-16 md:h-24 md:w-24 rounded-lg"
          />
          <div className="justify-center flex flex-col items-start">
            <Text className="md:text-variant-header">{source.name}</Text>
            <Text
              color="text-secondary"
              variant="sm-label"
              className="md:text-variant-body"
            >
              v{source.version}
            </Text>
            <Text color="hint" variant="sm-label">
              {source.link}
            </Text>
          </div>
        </div>
        <Checkbox isSelected={isSelected} />
      </button>
      <div className="pl-20 md:pl-28 w-full flex flex-row justify-end gap-2">
        <div
          className={
            'flex flex-row border-x-2 border-b-2 rounded-b-lg bg-paper border-default'
          }
        >
          <Link href={`https://${source.link}`}>
            <Button
              className="rounded-t-none rounded-br-none"
              icon={<MdLink />}
            >
              Website
            </Button>
          </Link>
          <div className="bg-border h-full w-0.5" />
          <Button
            className="rounded-t-none rounded-bl-none"
            icon={<MdOutlineSettings />}
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Source);
