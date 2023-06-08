import Button from '@components/Button';
import Icon from '@components/Icon';
import Skeleton from '@components/Skeleton';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { MangaDescriptionProps } from './MangaDescription.interfaces';
import { useTheme } from '@emotion/react';
import Box from '@components/Box/Box';
import MangaDescriptionHTMLRenderer from '@screens/MangaView/components/MangaViewerHeader/components/MangaDescription/renderers';

const MAX_CHARACTERS = 150;

const MangaDescription: React.FC<MangaDescriptionProps> = (props) => {
  const { data, loading } = props;
  const theme = useTheme();
  const [maxHeight, setMaxHeight] = React.useState<number | undefined>(
    MAX_CHARACTERS,
  );
  const isExpanded = maxHeight == null;
  const showExpand = data != null && data.length > MAX_CHARACTERS;
  function handleOnShowMore() {
    if (!isExpanded) setMaxHeight(undefined);
    else setMaxHeight(MAX_CHARACTERS);
  }

  return (
    <Stack space="s">
      <Stack
        flex-direction="row"
        space="s"
        justify-content="space-between"
        align-items="center"
      >
        <Text variant="header" bold>
          Synopsis
        </Text>
        {showExpand && (
          <Button
            iconPlacement="right"
            label={isExpanded ? 'Hide' : 'Expand'}
            icon={
              <Icon
                type="font"
                name={isExpanded ? 'chevron-down' : 'chevron-up'}
              />
            }
            onPress={handleOnShowMore}
          />
        )}
      </Stack>

      {data == null && loading ? (
        <>
          <Skeleton>
            <Text>Placeholder</Text>
          </Skeleton>
          <Skeleton>
            <Text>Placeholder</Text>
          </Skeleton>
          <Skeleton>
            <Text>Placeholder</Text>
          </Skeleton>
          <Skeleton>
            <Text>Placeholder</Text>
          </Skeleton>
          <Skeleton>
            <Text>Placeholder</Text>
          </Skeleton>
        </>
      ) : data ? (
        <Box
          maxHeight={maxHeight}
          overflow="hidden"
          border-width={{ b: 1 }}
          border-color={theme.palette.borderColor}
          pb="m"
        >
          <MangaDescriptionHTMLRenderer data={data} />
        </Box>
      ) : (
        <Text color="textSecondary" italic>
          No description available.
        </Text>
      )}
    </Stack>
  );
};

export default React.memo(MangaDescription);
