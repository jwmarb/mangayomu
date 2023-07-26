import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import React from 'react';
import {
  redis,
  SourceManga,
  mongodb,
  getMongooseConnection,
} from '@mangayomu/backend';
import { Manga, MangaHost } from '@mangayomu/mangascraper';
import MangaViewer from '@app/(root_bg_paper)/[source]/[title]/components/mangaviewer';
import Link from 'next/link';
import getSlug from '@app/helpers/getSlug';
import { TbError404 } from 'react-icons/tb';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import GoBackButton from '@app/(root_bg_paper)/[source]/[title]/components/gobackbutton';
import Genre from '@app/(root_bg_paper)/[source]/[title]/components/genre';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import { integrateSortedList } from '@mangayomu/algorithms';
import isMultilingual from '@app/helpers/isMultilingualChapter';
interface PageProps {
  params: {
    source: string;
    title: string;
  };
}
export const SortLanguages = (a: ISOLangCode, b: ISOLangCode) => {
  const lang1 = languages[a].name;
  const lang2 = languages[b].name;
  return lang1.localeCompare(lang2);
};

function getSourceFromSlug(sourceSlug: string) {
  const idx = MangaHost.sources.findIndex(
    (source) => getSlug(source) === sourceSlug,
  );
  return MangaHost.sourcesMap.get(MangaHost.sources[idx]);
}

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

  const meta = await host.getMeta(manga);
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const sanitizedDescription = purify.sanitize(meta.description);
  const supportedLanguages: ISOLangCode[] = [];
  const foundLanguages: Set<ISOLangCode> = new Set();
  const sorted = integrateSortedList(supportedLanguages, SortLanguages);
  if (isMultilingual(meta.chapters)) {
    for (const chapter of meta.chapters) {
      if (!foundLanguages.has(chapter.language)) {
        sorted.add(chapter.language);
        foundLanguages.add(chapter.language);
      }
    }
  } else {
    supportedLanguages.push('en'); // should be host.defaultLanguage; todo later
  }

  return (
    <Screen>
      <MangaViewer
        supportedLanguages={supportedLanguages.map((x) => [
          x,
          languages[x].name,
        ])}
        sanitizedDescription={sanitizedDescription}
        meta={meta}
        source={host.name}
      />
    </Screen>
  );
}

async function getSourceManga(pathName: string): Promise<Manga | null> {
  const cached = await redis.get(pathName);
  if (cached == null) {
    const { connect, close } = getMongooseConnection();
    await connect();
    const value = await SourceManga.findById(pathName);
    if (value == null) return null;
    await Promise.all([
      redis.set(pathName, JSON.stringify(value.toJSON())),
      close,
    ]);
    return value;
  }

  return JSON.parse(cached);
}
