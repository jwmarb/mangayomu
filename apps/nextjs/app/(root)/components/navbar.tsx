'use client';
import DarkMode from '@app/components/DarkMode';
import IconButton from '@app/components/IconButton';
import Text from '@app/components/Text';
import useBoolean from '@app/hooks/useBoolean';
import MenuIcon from 'mdi-react/MenuIcon';
import UserIcon from 'mdi-react/AccountIcon';
import HomeIcon from 'mdi-react/HomeOutlineIcon';
import SearchIcon from 'mdi-react/MagnifyIcon';
import AddIcon from 'mdi-react/AddIcon';
import HistoryIcon from 'mdi-react/HistoryIcon';
import ChevronLeftIcon from 'mdi-react/ChevronDoubleLeftIcon';
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
import ListButton from '@app/components/ListButton';
import { useSafeArea } from '@app/context/safearea';
import { useDarkMode } from '@app/context/darkmode';

export default function Navbar() {
  const drawerRef = React.useRef<DrawerMethods>(null);
  const user = useUser();
  const navbar = React.useRef<HTMLElement>(null);
  const mobile = useSafeArea((store) => store.mobile);
  const isDarkMode = useDarkMode((store) => store.isDarkMode);
  const setNavbarHeight = useSafeArea((store) => store.setHeaderHeight);
  const { scrollY } = useScroll();

  React.useLayoutEffect(() => {
    if (navbar.current) setNavbarHeight(navbar.current.offsetHeight);

    const listener = () => {
      if (navbar.current) setNavbarHeight(navbar.current.offsetHeight);
    };
    navbar.current?.addEventListener('resize', listener);
    return () => {
      navbar.current?.removeEventListener('resize', listener);
    };
  }, [setNavbarHeight]);

  return (
    <>
      {mobile && (
        <animated.nav
          ref={navbar}
          className={
            'fixed w-full flex flex-row items-center px-4 py-2 bg-primary'
          }
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
            icon={<MenuIcon />}
            onClick={() => drawerRef.current?.open()}
          />
        </animated.nav>
      )}
      <Drawer ref={drawerRef} className="w-64 p-4 flex flex-col gap-2">
        <div className="flex flex-row justify-between gap-2">
          <div className="flex flex-row gap-2 items-center">
            <div className="w-10 h-10 bg-default rounded-lg items-center justify-center flex">
              <UserIcon className="text-text-primary" />
            </div>
            <Text>{user.profile.name ?? 'Guest'}</Text>
          </div>
          {mobile && (
            <IconButton
              icon={<ChevronLeftIcon />}
              onPress={() => drawerRef.current?.close()}
            />
          )}
        </div>
        <div className="py-4 flex flex-col">
          <div>
            <Text variant="list-header" color="hint" className="py-1.5">
              Navigation
            </Text>
          </div>
          <ListButton active icon={<HomeIcon />}>
            Home
          </ListButton>
          <ListButton icon={<SearchIcon />}>Browse</ListButton>
          <ListButton icon={<HistoryIcon />}>History</ListButton>
          <div className="flex flex-row justify-between items-center">
            <Text variant="list-header" color="hint" className="py-1.5">
              My Library
            </Text>
            <IconButton icon={<AddIcon />} />
            {/* <Text
              variant="sm-badge"
              className="px-1.5 py-0.5 bg-primary rounded-md"
              color="primary-contrast"
            >
              3
            </Text> */}
          </div>
        </div>
        <DarkMode />
      </Drawer>
    </>
  );
}
