import Button from '@components/Button';
import Icon from '@components/Icon';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { MangaDescriptionProps } from './';
import { useTheme } from '@emotion/react';
import Box from '@components/Box/Box';
import MangaDescriptionHTMLRenderer from '@screens/MangaView/components/MangaViewerHeader/components/MangaDescription/renderers';
import useBoolean from '@hooks/useBoolean';
import { useMangaViewError } from '@screens/MangaView/context/ErrorContext';

const MangaDescription: React.FC<MangaDescriptionProps> = (props) => {
  const { data, loading } = props;
  const error = useMangaViewError();
  const theme = useTheme();
  const [isExpanded, toggleIsExpanded] = useBoolean();
  const [showExpand, setShowExpanded] = useBoolean();
  function handleOnShowMore() {
    toggleIsExpanded();
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
          {loading && !error ? 'Synopsis' : 'Error'}
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

      {loading ? (
        <Text.Skeleton numberOfLines={6} />
      ) : data ? (
        <Box
          border-width={{ b: '@theme' }}
          border-color={theme.palette.borderColor}
          pb="m"
        >
          <MangaDescriptionHTMLRenderer
            isExpanded={isExpanded}
            data={data}
            setShowExpanded={setShowExpanded}
          />
        </Box>
      ) : (
        <Text color="textSecondary" italic>
          {error || 'No description available.'}
        </Text>
      )}
    </Stack>
  );
};

export default React.memo(MangaDescription);
