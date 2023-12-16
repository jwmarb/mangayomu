import Button from '@components/Button';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import BottomSheet from '@gorhom/bottom-sheet';
import useRootNavigation from '@hooks/useRootNavigation';
import SourceWarningDetails from '@screens/Explore/components/SourceWarningDetails';
import { EmptyMangaListComponent } from '@screens/Explore/Explore';
import {
  keyExtractor,
  MangaListLoading,
  MangaSeparator,
  renderItem,
} from '@screens/Explore/Explore.flatlist';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import useAppSelector from '@hooks/useAppSelector';

const LatestMangaList: React.FC = () => {
  const latestMangas = useAppSelector((state) => state.explore.states.latest);
  const status = useAppSelector((state) => state.explore.status.latest);
  const errors = useAppSelector((state) => state.explore.errors.latest);
  const isOffline = useAppSelector(
    (state) => state.explore.internetStatus === 'offline',
  );
  const bookHeight = useAppSelector((state) => state.settings.book.height);
  const theme = useTheme();
  const navigation = useRootNavigation();
  const ref = React.useRef<BottomSheet>(null);
  function handleOnPress() {
    ref.current?.snapToIndex(1);
  }
  function handleOnPressSeeMore() {
    navigation.navigate('BasicMangaList', { stateKey: 'latest' });
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
              Recent updates{' '}
              <Icon
                type="font"
                name="clock-fast"
                color="primary"
                variant="header"
              />
            </Text>
          </Stack>
          {(latestMangas.length > 9 ||
            (status === 'loading' && !isOffline)) && (
            <Button
              label="See More"
              disabled={status === 'loading'}
              onPress={handleOnPressSeeMore}
            />
          )}
        </Stack>
        <FlashList
          ItemSeparatorComponent={MangaSeparator}
          contentContainerStyle={{ paddingHorizontal: theme.style.spacing.m }}
          ListHeaderComponent={
            <>
              {status === 'loading' && !isOffline && MangaListLoading}
              {isOffline && latestMangas.length === 0 && (
                <Text color="textSecondary">Offline</Text>
              )}
            </>
          }
          ListEmptyComponent={
            !isOffline && status === 'done'
              ? EmptyMangaListComponent
              : undefined
          }
          data={latestMangas.slice(0, 9)}
          estimatedItemSize={bookHeight}
          key={bookHeight}
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

export default LatestMangaList;
