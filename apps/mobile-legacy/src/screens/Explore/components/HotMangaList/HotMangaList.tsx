import Button from '@components/Button';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import useAppSelector from '@hooks/useAppSelector';
import useRootNavigation from '@hooks/useRootNavigation';
import SourceWarningDetails from '@screens/Explore/components/SourceWarningDetails';
import { EmptyMangaListComponent } from '@screens/Explore/Explore';
import {
  keyExtractor,
  MangaListLoading,
  MangaSeparator,
  renderItem,
} from '@screens/Explore/Explore.flatlist';
import FlashList from '@shopify/flash-list/dist/FlashList';
import React from 'react';

const HotMangaList: React.FC = () => {
  const hotMangas = useAppSelector((state) => state.explore.states.hot);
  const status = useAppSelector((state) => state.explore.status.hot);
  const errors = useAppSelector((state) => state.explore.errors.hot);
  const isOffline = useAppSelector(
    (state) => state.explore.internetStatus === 'offline',
  );
  const bookHeight = useAppSelector((state) => state.settings.book.height);
  const navigation = useRootNavigation();
  const theme = useTheme();
  const ref = React.useRef<BottomSheet>(null);
  function handleOnPress() {
    ref.current?.snapToIndex(1);
  }
  function handleOnPressSeeMore() {
    navigation.navigate('BasicMangaList', { stateKey: 'hot' });
  }
  return (
    <>
      <SourceWarningDetails ref={ref} status={status} errors={errors} />
      <Stack space="s" flex-direction="column">
        <Stack
          space="s"
          mx="m"
          flex-direction="row"
          justify-content="space-between"
          align-items="center"
          flex-grow
        >
          <Stack space="s" flex-direction="row" align-items="center">
            {(status === 'done_with_errors' ||
              status === 'failed_with_errors') && (
              <IconButton
                icon={<Icon type="font" name="alert-circle" />}
                color="warning"
                compact
                onPress={handleOnPress}
              />
            )}
            {isOffline && <Icon type="font" name="wifi-off" color="warning" />}
            <Text variant="header" bold>
              Trending updates{' '}
              <Icon
                type="font"
                name="fire"
                color="secondary"
                variant="header"
              />
            </Text>
          </Stack>
          {(hotMangas.length > 9 || (status === 'loading' && !isOffline)) && (
            <Button
              label="See More"
              disabled={status === 'loading'}
              onPress={handleOnPressSeeMore}
            />
          )}
        </Stack>
        <FlashList
          key={bookHeight}
          ListEmptyComponent={
            !isOffline && status === 'done'
              ? EmptyMangaListComponent
              : undefined
          }
          ItemSeparatorComponent={MangaSeparator}
          contentContainerStyle={{ paddingHorizontal: theme.style.spacing.m }}
          ListHeaderComponent={
            <>
              {status === 'loading' && !isOffline && MangaListLoading}
              {isOffline && hotMangas.length === 0 && (
                <Text color="textSecondary">Offline</Text>
              )}
            </>
          }
          data={hotMangas.slice(0, 9)}
          estimatedItemSize={bookHeight}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          {...{
            showsHorizontalScrollIndicator: false,
            showsVerticalScrollIndicator: false,
          }}
        />
      </Stack>
    </>
  );
};

export default HotMangaList;
