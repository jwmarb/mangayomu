import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import React from 'react';
import { redis, SourceManga } from '@mangayomu/backend';
import { Manga, MangaHost } from '@mangayomu/mangascraper';
import MangaViewer from '@app/(root)/[source]/[title]/components/mangaviewer';
interface PageProps {
  params: {
    source: string;
    title: string;
  };
}

export default async function Page(props: PageProps) {
  const {
    params: { source, title },
  } = props;
  const pathName = source + '/' + title;
  const manga = await getSourceManga(pathName);
  if (manga == null)
    return (
      <Screen>
        <Screen.Content>
          <Text variant="header">Not found</Text>
          <Text color="text-secondary">There is no manga</Text>
        </Screen.Content>
      </Screen>
    );
  const host = MangaHost.sourcesMap.get(manga.source);
  if (host == null)
    return (
      <Screen>
        <Screen.Content>
          <Text>{manga.source} does not exist</Text>
        </Screen.Content>
      </Screen>
    );

  const meta = await host.getMeta(manga);
  return (
    <Screen>
      <MangaViewer meta={meta} host={host} />
    </Screen>
  );
}

async function getSourceManga(pathName: string): Promise<Manga | null> {
  const cached = await redis.get(pathName);
  if (cached == null) {
    const value = await SourceManga.findById(pathName).exec();
    if (value == null) return null;
    await redis.set(pathName, JSON.stringify(value.toJSON()));
    return value;
  }

  return JSON.parse(cached);
}
