import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import React from 'react';
import { redis, SourceManga, getMongooseConnection } from '@mangayomu/backend';
import { Manga, MangaHost } from '@mangayomu/mangascraper';
import Link from 'next/link';
import getSlug from '@app/helpers/getSlug';
import { TbError404 } from 'react-icons/tb';
import { Metadata } from 'next';
import MangaViewer from './components/mangaviewer';
import GoBackButton from './components/gobackbutton';
import env from '@mangayomu/vercel-env';
import { IMAGE_PLACEHOLDER } from '@app/context/imageresolver';
interface PageProps {
  params: {
    source: string;
    title: string;
  };
}

export async function generateMetadata({
  params: { source, title },
}: PageProps): Promise<Metadata> {
  const pathName = source + '/' + title;
  const manga = await getSourceManga(pathName);

  if (manga == null)
    return {
      title: '404 Not Found',
    };

  const description = `Read ${manga.title} for free on MangaYomu`;

  return {
    title: manga.title + ' - MangaYomu',
    description,
    openGraph: {
      description,
      title: manga.title + ' - MangaYomu',
      images: [manga.imageCover ?? IMAGE_PLACEHOLDER],
      type: 'article',
    },
  };
}
const getSourceFromSlug = React.cache((sourceSlug: string) => {
  const idx = MangaHost.sources.findIndex(
    (source) => getSlug(source) === sourceSlug,
  );
  return MangaHost.sourcesMap.get(MangaHost.sources[idx]);
});

export default async function Page(props: PageProps) {
  const {
    params: { source, title },
  } = props;
  const pathName = source + '/' + title;
  const host = getSourceFromSlug(source);
  if (host == null)
    return (
      <Screen>
        <Screen.Content>
          <Text>{source} does not exist</Text>
        </Screen.Content>
      </Screen>
    );
  const manga = await getSourceManga(pathName);

  if (manga == null)
    return (
      <Screen>
        <Screen.Content className="flex flex-col items-center justify-center gap-4">
          <div>
            <TbError404 className="text-primary w-20 h-20 mx-auto" />
            <Text variant="header" className="text-center">
              Not found
            </Text>
            <Text color="text-secondary" className="text-center">
              The manga you are looking for does not exist in{' '}
              <Text color="primary">
                <Link href={`https://${host.link}/`}>{host.name}</Link>
              </Text>
            </Text>
          </div>
          <GoBackButton />
        </Screen.Content>
      </Screen>
    );

  const state = crypto.randomUUID();
  await redis.setex(state, 30, 0);

  return (
    <Screen>
      <MangaViewer manga={manga} source={host.name} state={state} />
    </Screen>
  );
}

const getSourceManga = React.cache(
  async (pathName: string): Promise<Manga | null> => {
    const cached = await redis.get(pathName);
    if (cached == null) {
      const { connect, close } = getMongooseConnection();
      await connect();
      const value = await SourceManga.findById(pathName);
      if (value == null) return null;
      await Promise.all([
        redis.setex(pathName, 300, JSON.stringify(value.toJSON())),
        close,
      ]);
      return value.toObject();
    }

    return JSON.parse(cached);
  },
);
