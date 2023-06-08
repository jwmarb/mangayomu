import Button from '@components/Button';
import Icon from '@components/Icon';
import Skeleton from '@components/Skeleton';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { MangaDescriptionProps } from './MangaDescription.interfaces';
import { useTheme } from '@emotion/react';
import RenderHTML, { MixedStyleDeclaration } from 'react-native-render-html';
import { typography } from '@theme/theme';
import Box from '@components/Box/Box';

const MAX_CHARACTERS = 150;

const MangaDescription: React.FC<MangaDescriptionProps> = (props) => {
  const { data, loading } = props;
  const theme = useTheme();
  const baseStyle: MixedStyleDeclaration = React.useMemo(
    () =>
      ({
        ...typography.body,
        color: theme.palette.text.secondary,
        margin: 0,
      } as MixedStyleDeclaration),
    [],
  );
  const tagStyles: Record<string, MixedStyleDeclaration> = React.useMemo(
    () => ({
      p: {
        ...typography.body,
        color: theme.palette.text.secondary,
        margin: 0,
      } as MixedStyleDeclaration,
      a: {
        ...typography.body,
        color: theme.palette.text.hint,
        margin: 0,
      } as MixedStyleDeclaration,
      hr: {
        marginVertical: theme.style.spacing.m,
      },
      h1: {
        margin: 0,
        color: theme.palette.text.primary,
        ...typography.header,
      } as MixedStyleDeclaration,
      h3: {
        ...typography.header,
        margin: 0,
        color: theme.palette.text.primary,
      } as MixedStyleDeclaration,
    }),
    [theme],
  );
  const { width } = useWindowDimensions();
  const [maxHeight, setMaxHeight] = React.useState<number | undefined>(
    MAX_CHARACTERS,
  );
  const isExpanded = maxHeight == null;
  const showExpand = data != null && data.length > MAX_CHARACTERS;
  function handleOnShowMore() {
    if (!isExpanded) setMaxHeight(undefined);
    else setMaxHeight(MAX_CHARACTERS);
  }

  const contentWidth = width - 2 * theme.style.spacing.m;
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
        // <Text>{data}</Text>
        <Box
          maxHeight={maxHeight}
          overflow="hidden"
          border-width={{ b: 1 }}
          border-color={theme.palette.borderColor}
          pb="m"
        >
          {React.useMemo(
            () => (
              <RenderHTML
                source={{ html: data }}
                contentWidth={contentWidth}
                tagsStyles={tagStyles}
                baseStyle={baseStyle}
              />
            ),
            [data, contentWidth],
          )}
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
