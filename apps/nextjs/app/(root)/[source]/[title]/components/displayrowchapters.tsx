'use client';
import { MangaChapter } from '@mangayomu/mangascraper';
import RowChapter from './rowchapter';
import React from 'react';
import Text from '@app/components/Text';

interface DisplayRowChaptersProps {
  chapters?: MangaChapter[] | null;
}

export default function DisplayRowChapters(props: DisplayRowChaptersProps) {
  const { chapters } = props;

  return (
    <div className="max-w-screen-md mx-auto w-full flex flex-col max-h-[41.25rem] overflow-y-auto pb-96">
      {chapters != null ? (
        chapters.map((x, i, self) => (
          <RowChapter
            chapter={x}
            key={x.link}
            isLastItem={i === self.length - 1}
          />
        ))
      ) : (
        <>
          <div className={'px-4 py-2 bg-default border-b-2 border-default'}>
            <Text.Skeleton text={['Chapter 1']} className="w-[15%]" />
            <Text.Skeleton text={['January 20, 2023']} className="w-[23.5%]" />
          </div>
          <div className={'px-4 py-2 bg-default border-b-2 border-default'}>
            <Text.Skeleton text={['Chapter 1']} className="w-[15%]" />
            <Text.Skeleton text={['January 20, 2023']} className="w-[23.5%]" />
          </div>
          <div className={'px-4 py-2 bg-default border-b-2 border-default'}>
            <Text.Skeleton text={['Chapter 1']} className="w-[15%]" />
            <Text.Skeleton text={['January 20, 2023']} className="w-[23.5%]" />
          </div>
          <div className={'px-4 py-2 bg-default border-b-2 border-default'}>
            <Text.Skeleton text={['Chapter 1']} className="w-[15%]" />
            <Text.Skeleton text={['January 20, 2023']} className="w-[23.5%]" />
          </div>
          <div className={'px-4 py-2 bg-default border-b-2 border-default'}>
            <Text.Skeleton text={['Chapter 1']} className="w-[15%]" />
            <Text.Skeleton text={['January 20, 2023']} className="w-[23.5%]" />
          </div>
          <div className={'px-4 py-2 bg-default'}>
            <Text.Skeleton text={['Chapter 1']} className="w-[15%]" />
            <Text.Skeleton text={['January 20, 2023']} className="w-[23.5%]" />
          </div>
        </>
      )}
    </div>
  );
}
