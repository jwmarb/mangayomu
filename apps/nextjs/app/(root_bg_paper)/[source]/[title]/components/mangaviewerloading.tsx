'use client';
import MangaSource from '@app/(root_bg_paper)/[source]/[title]/components/mangasource';
import Button from '@app/components/Button';
import IconButton from '@app/components/IconButton';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import { Manga } from '@mangayomu/mangascraper';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdFilterList } from 'react-icons/md';

export interface MangaViewerLoadingProps {
  meta: Manga;
}

export default function MangaViewerLoading(props: MangaViewerLoadingProps) {
  const { meta } = props;
  const router = useRouter();
  const onBack = () => {
    router.back();
  };

  return (
    <>
      <Screen.Header className="z-20 pb-2 flex flex-row gap-2 items-center">
        <IconButton onPress={onBack} icon={<MdArrowBack />} />
        <Text>{meta.title}</Text>
      </Screen.Header>
      <Screen.Content overrideClassName="relative flex flex-col">
        <div className="md:h-[35rem] h-[15rem] md:-mt-64 w-full bg-gradient-to-b from-transparent to-paper absolute">
          <div
            className="w-full h-full absolute -z-10"
            style={{
              backgroundImage: `url("${meta.imageCover}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
        <div className="z-10 flex flex-col gap-2 m-4 max-w-screen-md flex-grow w-full mx-auto px-4">
          <Image
            width={768}
            height={768}
            src={meta.imageCover}
            className="mx-auto object-contain rounded-lg max-w-full w-40 md:w-52 top-4"
            alt="Image cover"
          />
          <Text
            variant="header"
            className="text-center lg:text-variant-header-emphasized md:text-2xl"
          >
            {meta.title}
          </Text>
          <div className="flex flex-row space-x-2 justify-center items-center">
            <Button
              disabled
              size="large"
              variant="contained"
              className="flex-grow max-w-screen-sm"
            >
              <Text.Skeleton width="100%" variant="button" />
            </Button>
            <Button disabled variant="contained" color="secondary" size="large">
              <Text.Skeleton width="100%" variant="button" />
            </Button>
          </div>
          <div className="mt-10 flex flex-row items-center justify-between space-x-2">
            <Text variant="header">Synopsis</Text>
          </div>
          <div>
            <Text.Skeleton
              numberOfLines={6}
              classNames={['', '', '', '', '', 'w-[60%]']}
            />
          </div>
          <div className="h-0.5 w-full bg-border" />
          <div className="flex flex-row flex-wrap gap-2">
            {['Action', 'Adventure', 'Comedy', 'Drama', 'Romance'].map((x) => (
              <button
                key={x}
                className="bg-tag px-3 py-1.5 rounded-full hover:bg-hoverduration-250 transition focus:bg-hover focus:outline focus:outline-2 focus:outline-primary/[.3]"
              >
                <Text.Skeleton
                  className="font-normal text-sm tracking-tight"
                  text={[x]}
                />
              </button>
            ))}
          </div>
          <Text variant="header">Additional info</Text>
          <div className="flex flex-row justify-between gap-2">
            <Text color="text-secondary">Scan Status</Text>
            <div>
              <Text.Skeleton
                className="text-disabled font-medium"
                text={['Unknown']}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between gap-2">
            <Text color="text-secondary">Publish Status</Text>
            <div>
              <Text.Skeleton
                className="text-disabled font-medium"
                text={['Unknown']}
              />
            </div>
          </div>
          <MangaSource source={meta.source} />
          <div className="grid grid-cols-2 justify-between gap-2">
            <Text color="text-secondary">Supported languages</Text>
            <Text.Skeleton text={['English']} />
          </div>
          <div className="flex flex-row justify-between gap-2 items-center">
            <div>
              <Text.Skeleton variant="header" text={['100 Chapters']} />
            </div>
            <Button disabled icon={<MdFilterList />}>
              Filters
            </Button>
          </div>
        </div>
        <div className="h-0.5 w-full bg-border max-w-screen-md mx-auto" />
        <div className="max-w-screen-md mx-auto w-full flex flex-col max-h-[41.25rem] overflow-y-auto pb-96">
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
        </div>
      </Screen.Content>
    </>
  );
}
