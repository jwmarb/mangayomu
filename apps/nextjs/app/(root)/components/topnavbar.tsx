import IconButton from '@app/components/IconButton';
import { useDrawer } from '@app/context/drawer';
import { useSafeArea } from '@app/context/safearea';
import React from 'react';
import { MdMenu } from 'react-icons/md';

interface TopNavBarProps {
  onOpenDrawer: () => void;
}

export default function TopNavBar(props: TopNavBarProps) {
  const { onOpenDrawer } = props;
  const navRef = React.useRef<HTMLElement>(null);
  const setNavbarHeight = useSafeArea((store) => store.setHeaderHeight);
  const drawerVisible = useDrawer((store) => store.visible);

  React.useEffect(() => {
    if (navRef.current) setNavbarHeight(navRef.current.offsetHeight);
  }, [setNavbarHeight]);
  return (
    <nav
      ref={navRef}
      className={`lg:opacity-0 lg:pointer-events-none fixed w-full flex flex-row items-center px-4 py-2 bg-paper ${
        !drawerVisible ? 'z-30' : ''
      }`}
    >
      <IconButton icon={<MdMenu />} onClick={onOpenDrawer} />
    </nav>
  );
}
