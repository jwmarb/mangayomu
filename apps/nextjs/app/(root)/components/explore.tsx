'use client';
import Button from '@app/components/Button';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import TextField from '@app/components/TextField';
import useMangaHosts from '@app/hooks/useMangaHosts';
import React from 'react';
import { MdSearch } from 'react-icons/md';
import { BiTimer } from 'react-icons/bi';
import { BsFire } from 'react-icons/bs';
import MangaListCategory from '@app/(root)/components/mangalistcategory';
import { useExploreStore } from '@app/context/explore';
import { shallow } from 'zustand/shallow';
import cache from '@app/helpers/cache';
import { useRouter, useSearchParams } from 'next/navigation';
import ViewAllUpdates from '@app/(root)/components/viewallupdates';

export default function Explore() {
  const hosts = useMangaHosts();
  const router = useRouter();
  const params = useSearchParams();
  const [appendAllMangas, loadingAll] = useExploreStore(
    (store) => [store.appendAllMangas, store.loadingAll],
    shallow,
  );

  React.useEffect(() => {
    cache('explore', async () => {
      console.log('cache expired');
      loadingAll();
      const [recent, trending] = await Promise.all([
        hosts.getHotMangas(),
        hosts.getLatestMangas(),
      ]);
      appendAllMangas({ recent, trending });
    });
  }, [appendAllMangas, hosts, loadingAll]);

  const handleOnViewAllTrending = () => {
    router.push('?view_all=trending');
  };

  const handleOnViewAllRecent = () => {
    router.push('?view_all=recent');
  };

  const view_all = params.get('view_all');

  switch (view_all) {
    case 'recent':
    case 'trending':
      return <ViewAllUpdates type={view_all} />;
    default:
      return (
        <>
          <Screen.Header />
          <Screen.Content className="flex flex-col gap-4">
            <TextField
              className="flex-grow w-full"
              placeholder="Titles, authors, topics"
              adornment={<MdSearch />}
            />
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex flex-row items-center gap-2">
                <Text variant="header">Trending updates</Text>
                <BsFire className="text-variant-body text-secondary w-6 h-6" />
              </div>
              <Button onPress={handleOnViewAllTrending}>View all</Button>
            </div>
            <MangaListCategory category="trending" />
            <div className="flex flex-row justify-between items-center gap-2">
              <div className="flex flex-row items-center gap-2">
                <Text variant="header">Recent updates</Text>
                <BiTimer className="text-variant-body text-primary w-6 h-6" />
              </div>
              <Button onPress={handleOnViewAllRecent}>View all</Button>
            </div>
            <MangaListCategory category="recent" />
          </Screen.Content>
        </>
      );
  }
}
