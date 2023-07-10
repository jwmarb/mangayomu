import Box from '@components/Box';
import Skeleton from '@components/Skeleton';
import Stack from '@components/Stack';
import Text from '@components/Text';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';
import { MangaSupportedLanguagesProps } from './MangaSupportedLanguages.interfaces';
import { moderateScale } from 'react-native-size-matters';

const MangaSupportedLanguages: React.FC<MangaSupportedLanguagesProps> = (
  props,
) => {
  const { data } = props;

  return (
    <Stack space="s" flex-direction="row" justify-content="space-between">
      <Text color="textSecondary">Supported languages</Text>
      <Box maxWidth="50%" align-self="flex-end" flex-grow>
        {data == null ? (
          <Text.Skeleton
            numberOfLines={3}
            lineStyles={[{}, {}, { width: '50%' }]}
          />
        ) : (
          <Text bold>
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
