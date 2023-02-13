import Box from '@components/Box';
import Skeleton from '@components/Skeleton';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';
import { MangaSupportedLanguagesProps } from './MangaSupportedLanguages.interfaces';

const MangaSupportedLanguages: React.FC<MangaSupportedLanguagesProps> = (
  props,
) => {
  const { loading, supportedLang } = props;

  return (
    <Stack space="s" flex-direction="row" justify-content="space-between">
      <Text color="textSecondary">Supported languages</Text>
      <Box maxWidth="50%" align-self="flex-end">
        {loading ? (
          <Skeleton>
            <Text numberOfLines={1}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A ipsa,
              aut sed odit fuga iusto quo placeat eligendi minus natus dolore in
              neque aliquid, animi porro. Consequuntur repudiandae magnam
              voluptatum.
            </Text>
          </Skeleton>
        ) : (
          <Text bold>
            {supportedLang
              .map((x: unknown) => languages[x as ISOLangCode].name)
              .join(', ')}
          </Text>
        )}
      </Box>
    </Stack>
  );
};

export default React.memo(MangaSupportedLanguages);
