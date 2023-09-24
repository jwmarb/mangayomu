'use client';
import IconButton from '@app/components/IconButton';
import {
  MdAdd,
  MdHistory,
  MdOutlineExplore,
  MdSearch,
  MdOutlineBookmarks,
  MdOutlineLibraryBooks,
  MdOutlineCreateNewFolder,
} from 'react-icons/md';

import React from 'react';
import Drawer, { DrawerMethods } from '@app/(root)/components/drawer';
import * as List from '@app/components/List';
import { useRouter, usePathname } from 'next/navigation';
import { useAddedSources } from '@app/context/sources';
import ListSource from '@app/(root)/components/source';
import TopNavBar from '@app/(root)/components/topnavbar';
import User from '@app/(root)/components/user';
import { useMangaLibrary } from '@app/context/library';
import Link from 'next/link';

export default function Navbar() {
  const drawerRef = React.useRef<DrawerMethods>(null);
  const mangasInLibrary = useMangaLibrary((s) => s.mangas);
  const sources = useAddedSources((store) => store.sources);
  const router = useRouter();
  const pathname = usePathname();

  function handleOnOpenDrawer() {
    drawerRef.current?.open();
  }

  function handleOnCloseDrawer() {
    drawerRef.current?.close();
  }

  return (
    <>
      <TopNavBar onOpenDrawer={handleOnOpenDrawer} />
      <Drawer
        ref={drawerRef}
        className="w-64 p-4 flex flex-col gap-2 overflow-y-auto"
      >
        <User onDrawerClose={handleOnCloseDrawer} />
        <div className="flex flex-col space-y-2">
          <List.Category>
            <List.Accordion persist="accordion_list_home">
              <List.Header>Home</List.Header>
              <List.Accordion.Content>
                <Link href="/">
                  <List.Button
                    active={pathname === '/'}
                    icon={<MdOutlineExplore />}
                  >
                    Explore
                  </List.Button>
                </Link>
                <Link href="/library">
                  <List.Button
                    active={pathname === '/library'}
                    icon={<MdOutlineBookmarks />}
                  >
                    Library
                  </List.Button>
                </Link>

                <Link href="/browse">
                  <List.Button
                    active={pathname === '/browse'}
                    icon={<MdSearch />}
                  >
                    Browse
                  </List.Button>
                </Link>
                <Link href="/history">
                  <List.Button
                    active={pathname === '/history'}
                    icon={<MdHistory />}
                  >
                    History
                  </List.Button>
                </Link>
              </List.Accordion.Content>
            </List.Accordion>
          </List.Category>
          <List.Category>
            <List.Accordion persist="accordion_list_misc">
              <List.Header>Miscellaneous</List.Header>
              <List.Accordion.Content>
                <Link href="/sources">
                  <List.Button
                    active={pathname === '/sources'}
                    icon={<MdOutlineLibraryBooks />}
                  >
                    Sources
                  </List.Button>
                </Link>
              </List.Accordion.Content>
            </List.Accordion>
          </List.Category>
          <List.Category>
            <List.Accordion persist="accordion_sources">
              <List.Header
                badge={sources.length || undefined}
                icon={
                  <Link href="/sources">
                    <IconButton icon={<MdAdd />} />
                  </Link>
                }
              >
                My Sources
              </List.Header>
              <List.Accordion.Content className="space-y-1 flex flex-col">
                {sources.map((x) => (
                  <ListSource key={x} src={x} />
                ))}
              </List.Accordion.Content>
            </List.Accordion>
          </List.Category>
          <List.Category>
            <List.Accordion persist="accordion_library">
              <List.Header
                icon={<IconButton icon={<MdOutlineCreateNewFolder />} />}
                badge={mangasInLibrary.length || undefined}
              >
                My Library
              </List.Header>
            </List.Accordion>
          </List.Category>
        </div>
      </Drawer>
    </>
  );
}
