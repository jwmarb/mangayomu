import { ListItem, ListSection } from '@components/core';
import ItemDropdown from '@screens/Settings/screens/components/ItemDropdown';
import ItemToggle from '@screens/Settings/screens/components/ItemToggle';
import React from 'react';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import connector, { ConnectedCacheProps } from './Cache.redux';

const cacheSizes = [2e9, 1e9, 7.68e8, 5.12e8, 2.56e8, 1.28e8, 6.4e7];

function readableBytes(bytes: number): string {
  if (bytes >= 1e9) return `${bytes / 1e9} GB`;
  else if (bytes >= 1e6) return `${bytes / 1e6} MB`;
  else if (bytes >= 1000) return `${bytes / 1000} KB`;
  else return `${bytes} B`;
}

const Cache: React.FC<ConnectedCacheProps> = (props) => {
  const { cacheEnabled, maxCacheSize, toggleCache, setMaxCacheSize } = props;
  const items: MenuItemProps[] = React.useMemo(
    () =>
      cacheSizes.map((x) => ({
        text: readableBytes(x),
        onPress: () => {
          setMaxCacheSize(x);
        },
      })),
    []
  );
  return (
    <>
      <ListSection title='Cache' />
      <ItemToggle title='Enable caching' enabled={cacheEnabled} onChange={toggleCache} />
      {cacheEnabled && (
        <>
          <ItemDropdown title='Max cache size' subtitle={readableBytes(maxCacheSize)} items={items} />
          <ListItem title='Clear cache' subtitle='0 B' />
        </>
      )}
    </>
  );
};

export default connector(React.memo(Cache));
