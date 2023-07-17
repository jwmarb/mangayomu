import Box from '@components/Box';
import Stack from '@components/Stack';
import Text from '@components/Text';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';
import { MangaSupportedLanguagesProps } from './';

const MangaSupportedLanguages: React.FC<MangaSupportedLanguagesProps> = (
  props,
) => {
  const { data } = props;

  return (
    <Stack space="s" flex-direction="row" justify-content="space-between">
      <Text color="textSecondary">Supported languages</Text>
      <Box maxWidth="50%" flex-grow>
        {data == null ? (
          <Text.Skeleton
            numberOfLines={3}
            lineStyles={[
              {},
              { width: '90%', 'align-self': 'flex-end' },
              { width: '50%', 'align-self': 'flex-end' },
            ]}
          />
        ) : (
          <Text bold align="right">
            {data
              .map((x: unknown) => languages[x as ISOLangCode].name)
              .join(', ')}
          </Text>
        )}
      </Box>
    </Stack>
  );
};

export default React.memo(MangaSupportedLanguages);
