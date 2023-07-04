'use client';
import DarkMode from '@app/components/DarkMode';
import IconButton from '@app/components/IconButton';
import Text from '@app/components/Text';
import useBoolean from '@app/hooks/useBoolean';
import {
  MdAdd,
  MdMenu,
  MdPerson,
  MdHistory,
  MdHome,
  MdSearch,
  MdChevronLeft,
} from 'react-icons/md';

import React from 'react';
import {
  animated,
  easings,
  useScroll,
  useSpring,
  useSpringValue,
} from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import Drawer, { DrawerMethods } from '@app/(root)/components/drawer';
import { useUser } from '@app/context/realm';
import TextField from '@app/components/TextField';
import Button from '@app/components/Button';
import { useSafeArea } from '@app/context/safearea';
import { useDarkMode } from '@app/context/darkmode';
import * as List from '@app/components/List';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const drawerRef = React.useRef<DrawerMethods>(null);
  const user = useUser();
  const navbar = React.useRef<HTMLElement>(null);
  const mobile = useSafeArea((store) => store.mobile);
  const isDarkMode = useDarkMode((store) => store.isDarkMode);
  const setNavbarHeight = useSafeArea((store) => store.setHeaderHeight);
  const { scrollY } = useScroll();

  React.useEffect(() => {
    if (navbar.current) setNavbarHeight(navbar.current.offsetHeight);

    const listener = () => {
      if (navbar.current) setNavbarHeight(navbar.current.offsetHeight);
    };
    navbar.current?.addEventListener('resize', listener);
    return () => {
      navbar.current?.removeEventListener('resize', listener);
    };
  }, [setNavbarHeight, mobile]);

  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {mobile && (
        <animated.nav
          ref={navbar}
          className="fixed w-full flex flex-row items-center px-4 py-2 bg-primary"
          style={{
            backgroundColor: scrollY.to(
              [navbar.current?.offsetHeight ?? 0, 0],
              [
                isDarkMode ? 'rgb(9, 24, 26)' : 'rgb(255, 255, 255)',
                isDarkMode ? 'rgb(9, 24, 26)' : 'rgba(255, 255, 255, 0)',
              ],
            ),
          }}
        >
          <IconButton
            icon={<MdMenu />}
            onClick={() => drawerRef.current?.open()}
          />
        </animated.nav>
      )}
      <Drawer ref={drawerRef} className="w-64 p-4 flex flex-col gap-2">
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row gap-2 items-center">
            <div className="w-10 h-10 bg-default rounded-lg items-center justify-center flex">
              <MdPerson className="text-text-primary" />
            </div>
            <Text>{user.profile.name ?? 'Guest'}</Text>
          </div>
          {mobile && (
            <IconButton
              icon={<MdChevronLeft />}
              onPress={() => drawerRef.current?.close()}
            />
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <List.Category>
            <List.Accordion>
              <List.Header>Navigation</List.Header>
              <List.AccordionContent>
                <List.Button
                  onClick={() => router.push('/')}
                  active={pathname === '/'}
                  icon={<MdHome />}
                >
                  Home
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
              </List.AccordionContent>
            </List.Accordion>
          </List.Category>
          <List.Category>
            <List.Accordion>
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
