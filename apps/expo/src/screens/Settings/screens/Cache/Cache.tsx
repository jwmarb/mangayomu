import { ListItem, ListSection } from '@components/core';
import ItemDropdown from '@screens/Settings/screens/components/ItemDropdown';
import { ItemDropdownMenu } from '@screens/Settings/screens/components/ItemDropdown/ItemDropdown.interfaces';
import ItemToggle from '@screens/Settings/screens/components/ItemToggle';
import React from 'react';
import { InteractionManager } from 'react-native';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import connector, { ConnectedCacheProps } from './Cache.redux';
import * as FileSystem from 'expo-file-system';
import displayMessage from '@utils/displayMessage';
import ExpoStorage from '@utils/ExpoStorage';

const cacheSizes = [2e9, 1e9, 7.68e8, 5.12e8, 2.56e8, 1.28e8, 6.4e7];

function precisionify(number: number, precision?: number): string | number {
  if (precision == null) return number;
  return number.toFixed(precision);
}

function readableBytes(bytes: number, precision?: number): string {
  if (bytes >= 1e9) return `${precisionify(bytes / 1e9, precision)} GB`;
  else if (bytes >= 1e6) return `${precisionify(bytes / 1e6, precision)} MB`;
  else if (bytes >= 1000) return `${precisionify(bytes / 1000, precision)} KB`;
  else return `${precisionify(bytes, precision)} B`;
}

const Cache: React.FC<ConnectedCacheProps> = (props) => {
  const { cacheEnabled, maxCacheSize, toggleCache, setMaxCacheSize } = props;
  const [calculatedCacheSize, setCalculatedCacheSize] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string>('');
  function resetState() {
    setError('');
    setCalculatedCacheSize(null);
  }
  async function getCacheSize() {
    resetState();
    try {
      if (FileSystem.cacheDirectory == null || !cacheEnabled) return;
      const { size } = await FileSystem.getInfoAsync(ExpoStorage.IMAGE_CACHE_DIRECTORY);
      if (size == null) {
        setError('Could not calculate cache directory size');
        return;
      }
      setCalculatedCacheSize(size);
    } catch (e) {
      setError(JSON.stringify(e));
    }
  }
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      await getCacheSize();
    });
  }, [cacheEnabled]);
  const items: ItemDropdownMenu[] = React.useMemo(
    () =>
      cacheSizes.map((x) => ({
        text: readableBytes(x),
        isSelected: x === maxCacheSize,
        onPress: () => {
          setMaxCacheSize(x);
        },
      })),
    [maxCacheSize]
  );

  async function clearCache() {
    try {
      await FileSystem.deleteAsync(ExpoStorage.IMAGE_CACHE_DIRECTORY);
    } catch (e) {
      console.error(e);
    } finally {
      await FileSystem.makeDirectoryAsync(ExpoStorage.IMAGE_CACHE_DIRECTORY);
      displayMessage('Cleared cache.');
    }
    await getCacheSize();
  }

  return (
    <>
      <ListSection title='Cache' />
      <ItemToggle title='Enable caching' enabled={cacheEnabled} onChange={toggleCache} />
      {cacheEnabled && (
        <>
          <ItemDropdown title='Max cache size' subtitle={readableBytes(maxCacheSize)} items={items} />
          <ListItem
            title='Clear cache'
            onPress={clearCache}
            subtitle={
              calculatedCacheSize != null && !error
                ? readableBytes(calculatedCacheSize, 2)
                : calculatedCacheSize == null
                ? 'Calculating...'
                : error
            }
          />
        </>
      )}
    </>
  );
};

export default connector(React.memo(Cache));
