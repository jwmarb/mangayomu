import Box from '@components/Box';
import { CustomBottomSheet } from '@components/CustomBottomSheet';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { SourceError } from '@hooks/useMangaHost';
import { MangaHost } from '@mangayomu/mangascraper/src';
import React from 'react';
import { Image, ListRenderItem } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { SourceWarningDetailsProps } from './SourceWarningDetails.interfaces';
import ImprovedImage from '@components/ImprovedImage';

const Empty = (
  <Box>
    <Text align="center">There are no errors about a source to report</Text>
  </Box>
);

const SourceWarningDetails: React.ForwardRefRenderFunction<
  BottomSheetMethods,
  SourceWarningDetailsProps
> = (props, ref) => {
  const { errors, status } = props;
  return (
    <CustomBottomSheet
      header={
        <Box flex-direction="column">
          <Text variant="header" align="center">
            Errors
          </Text>
          {status === 'done' ? (
            <Text color="textSecondary" align="center">
              No errors found!
            </Text>
          ) : (
            <Text color="textSecondary" align="center">
              Failed to fetch data from <Text bold>{errors.length}</Text> source
              {errors.length === 1 ? '' : 's'}
            </Text>
          )}
        </Box>
      }
      ref={ref}
    >
      <BottomSheetFlatList
        ListEmptyComponent={Empty}
        data={errors}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </CustomBottomSheet>
  );
};

const styles = ScaledSheet.create({
  icon: {
    width: '32@ms' as unknown as number,
    height: '32@ms' as unknown as number,
  },
});

const MangaError: React.FC<{ item: SourceError }> = React.memo(
  ({ item: { source, error } }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const host = MangaHost.sourcesMap.get(source)!;
    return (
      <Stack flex-direction="row" space="m" m="s" align-items="center">
        <ImprovedImage // ImprovedImage
          source={{ uri: host.icon }}
          style={styles.icon}
        />
        <Box flex-direction="column">
          <Text color="error">{error}</Text>
          <Text color="textSecondary">Source name: {source}</Text>
        </Box>
      </Stack>
    );
  },
);

const renderItem: ListRenderItem<SourceError> = ({ item }) => (
  <MangaError item={item} />
);
const keyExtractor = (item: SourceError) => item.source;

export default React.memo(
  React.forwardRef<BottomSheetMethods, SourceWarningDetailsProps>(
    SourceWarningDetails,
  ),
);
