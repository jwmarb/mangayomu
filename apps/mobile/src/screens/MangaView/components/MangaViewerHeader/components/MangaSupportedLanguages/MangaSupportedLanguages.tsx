import Box from '@components/Box';
import Stack from '@components/Stack';
import Text from '@components/Text';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';
import { MangaSupportedLanguagesProps } from './';
import { useMangaViewError } from '@screens/MangaView/context/ErrorContext';

const MangaSupportedLanguages: React.FC<MangaSupportedLanguagesProps> = (
  props,
) => {
  const { data, hostDefaultLanguage, mangaLanguage } = props;
  const error = useMangaViewError();
  return (
    <Stack space="s" flex-direction="row" justify-content="space-between">
      <Text color="textSecondary">Supported languages</Text>
      <Box maxWidth="50%" flex-grow>
        {data == null && !error ? (
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
            {data != null &&
              data
                .map((x: unknown) => languages[x as ISOLangCode].name)
                .join(', ')}
            {data == null &&
              error &&
              hostDefaultLanguage != null &&
              (mangaLanguage != null
                ? languages[mangaLanguage].name
                : languages[hostDefaultLanguage].name)}
          </Text>
        )}
      </Box>
    </Stack>
  );
};

export default React.memo(MangaSupportedLanguages);
