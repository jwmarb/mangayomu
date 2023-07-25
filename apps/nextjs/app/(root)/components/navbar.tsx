'use client';
import DarkMode from '@app/components/DarkMode';
import IconButton from '@app/components/IconButton';
import Text from '@app/components/Text';
import {
  MdAdd,
  MdMenu,
  MdPerson,
  MdHistory,
  MdOutlineExplore,
  MdSearch,
  MdChevronLeft,
  MdOutlineBookmarks,
  MdSettings,
  MdOutlineLibraryBooks,
} from 'react-icons/md';

import React from 'react';
import Drawer, { DrawerMethods } from '@app/(root)/components/drawer';
import { useUser } from '@app/context/realm';
import { useSafeArea } from '@app/context/safearea';
import * as List from '@app/components/List';
import { useRouter, usePathname } from 'next/navigation';
import { useDrawer } from '@app/context/drawer';
import { useAddedSources } from '@app/context/sources';
import ListSource from '@app/(root)/components/source';
import TopNavBar from '@app/(root)/components/topnavbar';
import User from '@app/(root)/components/user';

export default function Navbar() {
  const drawerRef = React.useRef<DrawerMethods>(null);
  const user = useUser();
  const mobile = useSafeArea((store) => store.mobile);
  const setNavbarHeight = useSafeArea((store) => store.setHeaderHeight);
  const drawerVisible = useDrawer((store) => store.visible);
  const sources = useAddedSources((store) => store.sources);
  const navRef = React.useRef<HTMLElement>(null);
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
      <Drawer ref={drawerRef} className="w-64 p-4 flex flex-col gap-2">
        <User onDrawerClose={handleOnCloseDrawer} />
        <div className="flex flex-col space-y-2">
          <List.Category>
            <List.Accordion persist="accordion_list_home">
              <List.Header>Home</List.Header>
              <List.Accordion.Content>
                <List.Button
                  onClick={() => router.push('/')}
                  active={pathname === '/'}
                  icon={<MdOutlineExplore />}
                >
                  Explore
                </List.Button>
                <List.Button
                  active={pathname === '/library'}
                  onClick={() => router.push('/library')}
                  icon={<MdOutlineBookmarks />}
                >
                  Library
                </List.Button>

                <List.Button
                  active={pathname === '/browse'}
                  onClick={() => router.push('/browse')}
                  icon={<MdSearch />}
                >
                  Browse
                </List.Button>
                <List.Button
                  active={pathname === '/history'}
                  icon={<MdHistory />}
                >
                  History
                </List.Button>
              </List.Accordion.Content>
            </List.Accordion>
          </List.Category>
          <List.Category>
            <List.Accordion persist="accordion_list_misc">
              <List.Header>Miscellaneous</List.Header>
              <List.Accordion.Content>
                <List.Button
                  active={pathname === '/sources'}
                  onClick={() => router.push('/sources')}
                  icon={<MdOutlineLibraryBooks />}
                >
                  Sources
                </List.Button>
              </List.Accordion.Content>
            </List.Accordion>
          </List.Category>
          <List.Category>
            <List.Accordion persist="accordion_sources">
              <List.Header
                badge={sources.length || undefined}
                icon={
                  <>
                    <IconButton
                      icon={<MdAdd />}
                      onPress={() => router.push('/source-selector')}
                    />
                  </>
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
                icon={
                  <>
                    <IconButton icon={<MdAdd />} />
                  </>
                }
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
